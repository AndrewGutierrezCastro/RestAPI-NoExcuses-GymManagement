import API from "../API";
import { IBaseService } from "./IBaseService";

export class ProfileService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('profile', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('profile', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('profile', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('profile', filter, projection);
  }
}