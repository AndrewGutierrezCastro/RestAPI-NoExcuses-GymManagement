import { ClientWithoutRef } from './../model/Client';
import API from "../API";
import { RequestController } from "../controllers/RequestController";
import { Client } from "../model/Client";
import { IBaseService } from "./IBaseService";
import { Authenticator } from "../auth/Authenticator";
import { StarVerifier } from '../model/patterns/star_assigner/StarVerifier';

export class ClientService implements IBaseService {
  constructor(
    private reqControllerRef : RequestController
  ) {}

  async create(entity: object): Promise<object> {

    let client = <Client> entity;
    let responseCreatedUser = await Authenticator.registerUser(client); 

    if (!responseCreatedUser.newUser)
      return responseCreatedUser;

    let createdUser = responseCreatedUser.newUser;

    let client1 : ClientWithoutRef = {
      userId : createdUser._id,
      pendingPayment : [],
      balance : 0.00,
      memberships : [],
      favoritesServices : [],
      notifications : ["Felicidades por ser parte de nuestra comunidad fitness! Disfruta de nuestros servicios"]
    };
    let responseCreatedClient = await API.entityRepository.create('client', client1);

    return {  
      message : "El cliente se ha creado exitosamente",
      success: true,
      signup : true,
      object : responseCreatedClient
    };
  }


  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('client', oldEntityId, newEntity);
  }

  async delete(entityId : string) : Promise<object> {

    let client : any = await this.getOne(entityId);
    let userId = client.userId;
    let _ = await this.reqControllerRef.userService.delete(userId);

    return API.entityRepository.delete('client', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('client', filter, projection);
  }

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('client', entityId);
  }

  async getCompleted(filter: object, projection: object): Promise<object[]> {

    let clients = await API.entityRepository.get('client', filter, projection);

    let clientFilled = Promise.all(clients.map( async(client:any) => {
      let _client :any = await this.getOne(client._id);
      let {userId, ...clientWithoutId} = _client;

      let userInfo = await this.reqControllerRef.userService.getOne(userId);
      return {
        ...userInfo, 
        ..._client
      };
    }));

    return clientFilled;
  }

  async getClientWithAllInfo(clientId : string) : Promise<object>{
    let clientObj = <ClientWithoutRef> await this.reqControllerRef.clientService.getOne(clientId);
    let {password,...user} : any = await this.reqControllerRef.userService.getOne(clientObj.userId);

    return {...user,
            ...clientObj,
            };
  }

  async addFavoriteService(clientId : string, serviceId : string) : Promise<object> {

    let client = <ClientWithoutRef> await this.getOne(clientId);

    if (client.favoritesServices)
    {
      if (client.favoritesServices.includes(serviceId))
      {
        return {
          success : false,
          message : "El servicio seleccionado ya esta marcado como favorito"
        };
      }
      else
      {
        client.favoritesServices.push(serviceId);
      }
    }
    else
    {
      client.favoritesServices = [ serviceId ];
    }

    let {_id, ...clientWithoutId} = client;
    let result : any = await this.modify(_id, clientWithoutId);

    if (result?.modifiedCount > 0)
    {
      return {
        success : true,
        message : "Se ha agregado un nuevo servicio a tus favoritos"
      };
    }
    else
    {
      return {
        success : false,
        message : "Hubo un problema al agregar a tus favoritos"
      }
    }
  }

  async deleteFavoriteService(clientId : string, serviceId : string) : Promise<any> {

    let client = <ClientWithoutRef> await this.getOne(clientId);
    client.favoritesServices = client.favoritesServices.filter((sId) => sId != serviceId);

    let {_id, ...clientWithoutId} = client;
    let result : any = await this.modify(_id, clientWithoutId);

    return {
      success : true,
      message : "Se ha eliminado el servicio de tus favoritos"
    }
  } 

  async getFavoritesServices(clientId : string) : Promise<any> {

    let client = <ClientWithoutRef> await this.getOne(clientId);

    if (client.favoritesServices?.length > 0)
    {
      let populatedServices = await Promise.all(client.favoritesServices.map(async (serviceId) => {
        return await this.reqControllerRef.serviceService.getOne(serviceId);
      }));

      return {
        services : populatedServices,
        message : "Estos son tus servicios favoritos"
      }
    }
    else
    {
      return {
        services : [],
        message : "No tienes servicios favoritos aun"
      }
    }
  } 

  async addNotification(clientId : string, notification : string) {
    let {_id, ...clientWithoutId} = <Client> await this.getOne(clientId);
    clientWithoutId.notifications.push(notification);
    let storeInfo = await this.modify(_id, clientWithoutId);
  }
  
  async checkStars() : Promise<object>{
    let clientsIds =  await this.get({},{});
    let clients = await Promise.all(clientsIds.map(async (client1 : any) =>{
      let client : any = await this.getClientWithAllInfo(client1._id);
      return new Client(client);
      }
    ));
    //VISITORSH
    let starVerifier = new StarVerifier(this.reqControllerRef);
    await Promise.all(clients.map(async (client : Client) => {
        await client.accept(starVerifier);
        await this.modify(client._id, client);
      }
    ));
    return {message : `Se han otorgado las estrellas del bloque fechas actual. Se modificaron ${clients.length}`,
            result : true ,
            object : clients
    }
  }
}