import API from "../API";
import { IBaseService } from "./IBaseService";

const DEFAULT_USER_PROJECTION = { 
  _id : 1, 
  username: 1, 
  lastName: 1, 
  firstName: 1, 
  email: 1, 
  identification: 1, 
  role: 1, 
  phoneNumber: 1,
};

export class UserService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('users', entity);
  }

  modify(oldEntityId: string, newEntity: object): Promise<object> {
    return API.entityRepository.modify('users', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('users', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('users', filter, DEFAULT_USER_PROJECTION);
  }
}