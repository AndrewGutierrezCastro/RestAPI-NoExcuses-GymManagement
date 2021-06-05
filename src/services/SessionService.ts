import API from "../API";
import { ObjectId } from "../repository/IBaseRepository";
import { IBaseService } from "./IBaseService";

export class SessionService implements IBaseService {

  create(entity: object): Promise<object> {
    return API.entityRepository.create('sessions', entity);
  }
  modify(oldEntityId: string, newEntity: object): Promise<object> {
    return API.entityRepository.modify('sessions', oldEntityId, newEntity);
  }
  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('sessions', entityId);
  }
  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('sessions', filter, projection);
  }
  public getAvailableAmount(sessionId : string) : Number {
    return 0;
  }
}