import API from "../API";
import { RequestController } from "../controllers/RequestController";
import { IBaseService } from "./IBaseService";

export class PermissionService implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ){}

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

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('permission', entityId);
    }
}