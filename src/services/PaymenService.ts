import API from "../API";
import { IBaseService } from "./IBaseService";

export class PaymentService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('payment', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('payment', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('payment', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('payment', filter, projection);
  }
}