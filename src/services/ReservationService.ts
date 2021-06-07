import API from "../API";
import { IBaseService } from "./IBaseService";

export class ReservationService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('reservation', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('reservation', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('reservation', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('reservation', filter, projection);
  }
}