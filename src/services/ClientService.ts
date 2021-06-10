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

    let client : Client = <Client> entity;
    //CREATE USER WITH ENTITY USER DATA
    let responseCreatedUser = await Authenticator.registerUser(client); 
    let createdUser = responseCreatedUser.newUser;

    //Set id user to entity client
    client._id = createdUser._id;

    //create client
    let responseCreatedClient = await API.entityRepository.create('client', client);

    return {  message : "El cliente se ha creado exitosamente",
              success: true,
              object : responseCreatedClient
            }
  }


  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('client', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('client', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('client', filter, projection);
  }

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('client', entityId);
  }
}