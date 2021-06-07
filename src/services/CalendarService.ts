import API from "../API";
import { IBaseService } from "./IBaseService";

export class CalendarService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('calendar', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('calendar', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('calendar', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('calendar', filter, projection);
  }
}