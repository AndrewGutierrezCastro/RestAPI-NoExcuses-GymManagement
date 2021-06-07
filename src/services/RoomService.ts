import API from "../API";
import { IBaseService } from "./IBaseService";

export class RoomService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('room', entity);
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
}