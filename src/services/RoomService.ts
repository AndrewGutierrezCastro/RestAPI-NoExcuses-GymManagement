import API from "../API";
import { IBaseService } from "./IBaseService";
import { RequestController } from "../controllers/RequestController";
import { RewardPublisher } from "../model/patterns/waiting_list-reward_checker/RewardPublisher";
import { Subscriber } from "../model/patterns/waiting_list-reward_checker/Subscriber";

export class RoomService extends RewardPublisher implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ){
    super();
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

  async giveClientReward() {
    
    // TODO: fabricar premio segun las estrellas para cada cliente

    // TODO: obtener toda la info de los clientes incluyendo estrellas
    let clients: object = [];

    // TODO: notificar a los clientes de los premios recibidos
    await this.notifySubscribers(clients);
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