import API from "../API";
import { IBaseService } from "./IBaseService";

export class PermissionService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('permission', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('permission', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('permission', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('permission', filter, projection);
  }
}