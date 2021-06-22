import { ClientWithoutRef } from './../model/Client';
import API from "../API";
import { RequestController } from "../controllers/RequestController";
import { Client } from "../model/Client";
import { IBaseService } from "./IBaseService";
import { Authenticator } from "../auth/Authenticator";

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

    return {...clientObj,
            ...user
            };
  }
}