import API from "../API";
import mongoose from "mongoose";
import { Client } from "../model/Client";
import { Membership } from "../model/Membership";
import { Payment } from "../model/Payment";
import { IBaseService } from "./IBaseService";
import { RequestController } from "../controllers/RequestController";

export class MembershipService implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ) {}

  create(entity: object): Promise<object> {

    return API.entityRepository.create('membership', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('membership', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('membership', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('membership', filter, projection);
  }

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('membership', entityId);
    }
  async createMembership(pMembership : Membership , clientId : string, pPayment : Payment) : Promise<object>{
    //TODO create payment
    let responseCreatedPayment : any = await this.reqControllerRef.paymentService.create(pPayment);
    let createdPaymentId = responseCreatedPayment.insertedId;
    //TODO Associate client to membership
    pMembership.paymentId = createdPaymentId;
    pMembership.clientId = clientId;
    //TODO Create membership
    let responseCreatedMembership : any = await this.create(pMembership);
    let createdMembership : any = responseCreatedMembership.insertedId;

    return {  message : "La membresia ha sido creada con exito", 
              success : true,
              object  : createdMembership
           }
  }
  async generateMembership(pPayment : Payment, clientId : string, membershipId : string) : Promise<Object> {
    //Obtener los objetos de la base de datos
    let payment : any = await this.reqControllerRef.paymentService.create(pPayment);
    let client : any =  await this.reqControllerRef.clientService.getOne(clientId);
    //Crear la membresia
    let membership : Membership = <Membership> await this.getOne(membershipId);

    //agregar el pago pendiente a la lista del cliente
    client.pendingPayment.push(payment.createdObject._id);

    //el cliente modificado
    let client2 : any  = await this.reqControllerRef.clientService.modify(client._id, client);

    //seter el clientId a la membresia
    membership.clientId = client2.updatedElement._id;
    //obtener la nueva membresia modificada
    let membership2 : any = await this.modify(membership._id, membership);

    return {  message : "Membresia generada con exito",
              success : true,
              object  : membership2.updatedElement
            };

  }

  async applyMembership() : Promise<Object>{
    return {  message : "Metodo no implementado",
              success : false,
              object  : {}
            };
  }
  
  async hasMembership(pClientId : string) : Promise<boolean>{
    let objClientId = new mongoose.mongo.ObjectID(pClientId);
    let memberships = await this.get({clientId : objClientId}, {});
    return memberships.length > 0;
  }

  async hasActiveMembership(pClientId : string) : Promise<object>{
    if(await this.hasMembership(pClientId)){
      return {  message: "No tiene ninguna membresia ",
                success: false,
                object : null
              };
    }else{
      let objClientId = new mongoose.mongo.ObjectID(pClientId);
      let memberships = <Membership[]> await this.get({clientId : objClientId}, {});
      let result = false;
      let todayDate = new Date();
      memberships.some((membership) => {
        membership.createdDate.setDate(membership.createdDate.getDate() + membership.daysAmount);

        result = result || membership.createdDate >= todayDate || membership.sessionsAmount > 0
      });
      if(result){
        return {  message: "Tiene una membresia activa",
                  success: result,
                  object : null
                };
      }else{
        return {  message: "No tiene una membresia activa",
                  success: result,
                  object : null
                };
      }
    }
  }

  async isDefaulter(pClientId : string) : Promise<object>{
    let client  = <Client> await this.reqControllerRef.clientService.getOne(pClientId);
    let isDefaulter = client.pendingPayment.length > 0;

    return {  message : isDefaulter ? 
                          `El cliente ${client.firstName} ${client.lastName}, esta moroso. 
                          Tiene ${client.pendingPayment.length} cuentas pendientes.` 
                        : `El cliente ${client.firstName} ${client.lastName}, no esta moroso.`,
              success : isDefaulter
            };
  }

  async itsAllowedToReserve(pClientId : string) : Promise<object>{
    let hasActiveMembership : any = await this.hasActiveMembership(pClientId);
    let isDefaulter : any = await this.isDefaulter(pClientId);
    return  {  message : !(hasActiveMembership.success && !isDefaulter.success) ? 
                              `El cliente no puede reservar.` 
                            : `El cliente puede reservar.`,
              success : hasActiveMembership.success && !isDefaulter.success
            };
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