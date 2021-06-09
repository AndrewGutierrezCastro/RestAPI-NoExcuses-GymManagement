import API from "../API";
import mongoose from 'mongoose';
import { IBaseService } from "./IBaseService";
import { MembershipService } from "./MembershipService";
import { Membership } from "../model/Membership";
import { Client } from "../model/Client";

export class ClientService implements IBaseService {
  constructor(
    private membershipService : MembershipService = new MembershipService(),
  ){  }

  create(entity: object): Promise<object> {
    return API.entityRepository.create('client', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('client', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('client', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('client', filter, projection);
  }

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('client', entityId);
    }
  async hasActiveMembership(pClientId : string) : Promise<object>{
    let objClientId = new mongoose.mongo.ObjectID(pClientId);
    let memberships = <Membership[]> await this.membershipService.get({clientId : objClientId}, {});
    let result = false;
    let todayDate = new Date();
    memberships.some((membership) => {
      membership.createdDate.setDate(membership.createdDate.getDate() + membership.daysAmount);

      result = result || membership.createdDate >= todayDate || membership.sessionsAmount > 0
    });
    if(result){
      return {  message: "Tiene una membresia activa",
                success: result
              };
    }else{
      return {  message: "No tiene una membresia activa",
                success: result
              };
    }
  }

  async isDefaulter(pClientId : string) : Promise<boolean>{
    let client  = <Client> await this.getOne(pClientId);
    return client.pendingPayment.length > 0;
  }

  async itsAllowedToReserve(pClientId : string) : Promise<boolean>{
    let hasActiveMembership : any = await this.hasActiveMembership(pClientId);
    let isDefaulter : any = await this.isDefaulter(pClientId);
    return hasActiveMembership.success || !isDefaulter;
  }

  async applyCharge(pClientId : string) : Promise<Object>{
    return {  message : "Metodo no implementado",
              success : false,
              object  : {}
            };
  }

  async refund(pCliendId : string) : Promise<Object>{
    return {  message : "Metodo no implementado",
              success : false,
              object  : {}
            };
  }
}