import API from "../API";
import { IBaseService } from "./IBaseService";

export class ClientService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('client', entity);
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
}