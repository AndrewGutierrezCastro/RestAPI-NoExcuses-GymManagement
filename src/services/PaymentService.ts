import API from "../API";
import { RequestController } from "../controllers/RequestController";
import { IBaseService } from "./IBaseService";

export class PaymentService implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ) {}

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

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('payment', entityId);
  }
}