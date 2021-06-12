import API from "../API";
import mongoose from "mongoose";
import { Client } from "../model/Client";
import { Membership } from "../model/Membership";
import { Payment } from "../model/Payment";
import { IBaseService } from "./IBaseService";
import { RequestController } from "../controllers/RequestController";

export class MembershipOfferService implements IBaseService {
  
  constructor(
    private reqControllerRef : RequestController 
  ) { }
  
  create(entity: object): Promise<object> {
    return API.entityRepository.create('membershipoffer', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('membershipoffer', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('membershipoffer', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('membershipoffer', filter, projection);
  }

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('membershipoffer', entityId);
  }
}