import API from "../API";
import { IBaseService } from "./IBaseService";
import { RequestController } from "../controllers/RequestController";
import { RewardPublisher } from "../model/patterns/waiting_list-reward_checker/RewardPublisher";
import { Subscriber } from "../model/patterns/waiting_list-reward_checker/Subscriber";
import { ClientRewardOneStar } from "../model/patterns/rewards/ClientRewardOneStar";
import { ClientRewardTwoStar } from "../model/patterns/rewards/ClientRewardTwoStar";
import { ClientRewardThreeStar } from "../model/patterns/rewards/ClientRewardThreeStar";
import { Client } from "../model/Client";
import { BaseClientReward } from "../model/patterns/rewards/BaseClientReward";

const MAXIMUM_STAR_AMOUNT = 3;
const MINIMUM_STAR_AMOUNT = 0;

export class RoomService extends RewardPublisher implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ){
    super();
    console.log(this.reqControllerRef.clientService);
    this.subscribers.push(this.reqControllerRef.clientService);
  }

  async create(entity: any): Promise<object> {
    //Crear la nueva sala
    entity.monthlyCalendar = null; 
    let room : any = await API.entityRepository.create('room', entity);

    //Crear date para obtener la fecha actual
    let date = new Date();
    
    //crear un calendario preeliminar a la nueva sala creada
    let calendar = <any> await API.entityRepository.create('calendar',
                  { roomId: room.createdObject._id,
                    month : date.getMonth().toString(),
                    year : date.getFullYear().toString(),
                    published : false, //cambia a true cuando se cambia de calendario preeliminar a actual
                    sessions : [],
                  }
                );
    //retornar la sala
    return room;
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('room', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('room', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('room', filter, projection);
  }

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('room', entityId);
  }

  async giveClientReward() : Promise<object>{
    
    // una vez el administrador hace el listado del programa de disciplina,
    // al final del mes, con las estrellas de los usuarios otorgadas
    // se procede a notificar a cada uno de ellos con el premio

    const assignStar = (client : Client) => {

      let clientStars = client.starLevel;

      clientStars = clientStars.filter(starLevel => starLevel != undefined);

      if (clientStars.length == 0)
          return MINIMUM_STAR_AMOUNT;
      
      return client.starLevel.reduce(
          (acm, item) => item < acm ? item : acm, 
          MAXIMUM_STAR_AMOUNT
      );
    };

    let clients = <Client[]> await this.reqControllerRef.clientService.getCompleted({},{});

    let clientWithRewards = clients.map(client => {

      // se procede a fabricar el premio segun el nivel de estrellas obtenidas
      let decorator = new BaseClientReward();

      // se obtiene la menor cantidad de estrellas, entre los diferentes bloques
      // del mes
      let clientStars = assignStar(client);

      let baseMessage = 'Se ha realizado la revision de disciplina, estos son tus resultados:\n'
      let clientReward = baseMessage;
      let noRewardMsg = 
        `[
          Si eres lo suficientemente activo 
          con tus servicios favoritos podras
          ganar premios cada mes, suerte 
          la próxima
        ] `;

      // se fabrica el premio segun la cantidad de estrellas
      switch(clientStars) 
      {
        case 1: {
          decorator = new ClientRewardOneStar(decorator);
          break;
        }

        case 2: {
          decorator = new ClientRewardOneStar(decorator);
          decorator = new ClientRewardTwoStar(decorator);
          break;
        }

        case 3: {
          decorator = new ClientRewardOneStar(decorator);
          decorator = new ClientRewardTwoStar(decorator);
          decorator = new ClientRewardThreeStar(decorator);
          break;
        }
      }

      clientReward += decorator.giveReward();

      if (clientReward === baseMessage)
        clientReward += noRewardMsg;

      return {
        client,
        reward : clientReward
      };
    });

    // console.log(clientWithRewards);

    // notificar a los clientes de los premios recibidos
    await this.notifySubscribers(clientWithRewards);

    return {
      message : 'Se han otorgado los premios segun el nivel de estrellas de cada cliente',
      success : true,
      info: clientWithRewards
    };
  }

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }
  async notifySubscribers(data: object): Promise<void> {
    this.subscribers.forEach(async (subscriber : Subscriber) => {
      await subscriber.update(data);
    })
  }
  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter(s => s !== subscriber);
  }
}