import API from "../API";
import { ObjectId } from "../repository/IBaseRepository";
import { IBaseService } from "./IBaseService";

export interface SessionGetParams {
  filter : any,
  projection : any
};

export class SessionService implements IBaseService {

  create(entity: object): Promise<boolean> {
    return API.entityRepository.create('sessions', entity).then(() => true).catch(() => false);
  }
  modify(oldEntity: object, newEntity: object): Promise<boolean> {
    return API.entityRepository.modify('sessions', oldEntity, newEntity);
  }
  delete(entityId : ObjectId) : Promise<boolean> {
    return API.entityRepository.delete('sessions', entityId);
  }
  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('sessions', filter, projection);
  }
  public getAvailableAmount(sessionId : string) : Number {
    return 0;
  }
}