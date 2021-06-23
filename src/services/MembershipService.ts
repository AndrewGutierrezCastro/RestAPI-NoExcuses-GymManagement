import API from "../API";
import { Client } from "../model/Client";
import { Membership } from "../model/Membership";
import { Payment } from "../model/Payment";
import { IBaseService } from "./IBaseService";
import { RequestController } from "../controllers/RequestController";

const REFUNDSESSIONS : number = 1;
const SESSIONSAMOUNT : string = "SESSIONSAMOUNT";
const DAYSAMOUNT : string = "DAYSAMOUNT";
export class MembershipService implements IBaseService {
  
  constructor(
    private reqControllerRef : RequestController 
  ) { }
  
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
    //create payment
    let responseCreatedPayment : any = await this.reqControllerRef.paymentService.create(pPayment);
    let createdPaymentId = responseCreatedPayment.insertedId;
    //Associate client to membership
    pMembership.paymentId = createdPaymentId;
    pMembership.clientId = clientId;
    //Create membership
    let responseCreatedMembership : any = await this.create(pMembership);
    let createdMembership : any = responseCreatedMembership.insertedId;

    //Update client
    let client : any = await this.reqControllerRef.clientService.getOne(clientId);
    client.memberships.push(createdMembership);//id de la memebresia

    let client2 : any = await this.reqControllerRef.clientService.modify(client._id,client);

    return {  message : "La membresia ha sido adquirida con exito", 
              success : true,
              object  : createdMembership
           }
  }

  async applyMembership(pMembershipId : any) : Promise<Object>{
    //obtner la membresia
    let membership = <Membership> await this.getOne(pMembershipId);
    //aplicar el resto de membresia por reservacion
    let membership2 : Membership = membership.typeMembership===SESSIONSAMOUNT ? 
      this.applyMembershipByAmountSessions(membership) : 
      this.applyMembershipByDays(membership);    
  
    //modificar la membresia actual
    let membership3 : any = await this.modify(membership2._id, membership2);
    
    return {  message : "Se ha aplicado su membresia",
              success : true,
              object  : membership3.updatedElement
            };
  }
  
  private applyMembershipByAmountSessions(pActiveMembership : Membership) : Membership{
    pActiveMembership.state = pActiveMembership.sessionsAmount < 2 ? false : true;
    pActiveMembership.sessionsAmount = pActiveMembership.sessionsAmount - 1;
    return pActiveMembership;
  }
  private applyMembershipByDays(pActiveMembership : Membership) : Membership{
    return pActiveMembership;
  }

  async hasMembership(pClientId : string) : Promise<boolean>{

    let client : Client = <Client> await this.reqControllerRef.clientService.getOne(pClientId);
    let memberships = client.memberships;
    return memberships.length > 0;
  }

  async hasActiveMembership(pClientId : string) : Promise<object>{
    if(!(await this.hasMembership(pClientId))){
      return {  message: "No tiene ninguna membresia",
                success: false,
                object : null
              };
    }else{
      let client : Client = <Client> await this.reqControllerRef.clientService.getOne(pClientId);
      let memberships = client.memberships;

      let todayDate = new Date();
      let membership : Membership;
      //variable para guardar la membresia activa al encontrarla
      
      let result = memberships.some(async (membershipId) => {
        membership = <Membership> await this.reqControllerRef.membershipService.getOne(membershipId);
        
        membership.createdDate.setDate(membership.createdDate.getDate() + membership.daysAmount);
        
        return membership.createdDate >= todayDate || membership.sessionsAmount > 0;
      });
      //obtener la membresia actual 
      let activeMembership : any = result ? await this.getActiveMembership(memberships): null;

      if(result){
        return {  message: "Tiene una membresia activa",
                  success: result,
                  object : activeMembership
                };
      }else{
        return {  message: "No tiene una membresia activa",
                  success: result,
                  object : null
                };
      }
    }
  }
  private async getActiveMembership(pMemberships : string[]){
    
    let activeMembershipId : any = pMemberships.find( async (element : string) => {
      return await this.isActive(element);
    });
    let activeMembership = await this.getOne(activeMembershipId);
    return activeMembership;
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
    //tiene membresia activa
    let hasActiveMembership : any = await this.hasActiveMembership(pClientId);
    //esta moroso
    let isDefaulter : any = await this.isDefaulter(pClientId);
    //puede reservar
    let itsAllowedToReserve = hasActiveMembership.success && !isDefaulter.success;
    let message = hasActiveMembership.success ? "Tiene una membresia activa" :  "No tiene una membresia activa";
    message = message + (isDefaulter.success ? " y esta moroso" : " y no esta moroso");
    //Si puede reservar se muestra el mensaje que se puede reservar o porque no
    return  {  message : itsAllowedToReserve ? 
                              "El cliente puede reservar. " + message
                            : "El cliente no puede reservar. " +  message,
              success : itsAllowedToReserve
            };
  }

  async applyCharge(pClientId : string, pPayment : Payment) : Promise<Object>{
    //create payment
    let responseCreatedPayment : any = await this.reqControllerRef.paymentService.create(pPayment);
    let createdPaymentId = responseCreatedPayment.insertedId;
    //Get client
    let client1 : Client = <Client> await this.reqControllerRef.clientService.getOne(pClientId);
    //Associate payment to Client
    client1.pendingPayment.push(createdPaymentId);
    //Update client
    let client2 : any = await this.reqControllerRef.clientService.modify(client1._id, client1);

    return {  message : `Se le ha hecho el cargo a  ${client2.updatedElement.firstName}, de: ${responseCreatedPayment.createdObject.amount}.`,
              success : true,
              object  : responseCreatedPayment.createdObject
            };
  }

  async refund(pCliendId : string) : Promise<Object>{

    //Obtener el cliente de la base de datos
    let client : any = await this.reqControllerRef.clientService.getOne(pCliendId);
    //buscar la membresia activa
    let activeMembershipId : any = null;
    activeMembershipId = await client.memberships.find( async (element : string) => {
      return await this.isActive(element);
    });

    //Sino tiene ninguna membresia activa se envia la respuesta 
    if(activeMembershipId===null){
      return {  message : "No se ha encontrado una membresia activa",
                success : false,
                object  : null
              };
    }
    //obtener la membresia
    let membership : any = await this.getOne(activeMembershipId);
    let membership2 = membership.typeMembership===SESSIONSAMOUNT ? 
      this.refundMembershipByAmountSessions(membership) : 
      this.refundMembershipByDays(membership);    

    let membership4 : any = await this.getOne(activeMembershipId);
    let membership3 : any = await this.modify(membership2._id, membership2);

    return {  message : "Se ha hecho un reembolso a su cuenta",
              success : true,
              object  : { old : membership4,
                          updated: membership3.updatedElement
                        }
            };
  }

  private refundMembershipByAmountSessions(pMembership : Membership) : Membership{
    pMembership.sessionsAmount = pMembership.sessionsAmount + REFUNDSESSIONS;
    return pMembership;
  }
  private refundMembershipByDays(pMembership : Membership) : Membership {
    return pMembership;
  }
  private async isActive(pMembresiaId : string) : Promise<boolean>{
    let membresia : Membership = <Membership> await this.getOne(pMembresiaId);
    let endDate : Date = membresia.createdDate;
    endDate.setDate(endDate.getDate() + membresia.daysAmount);
    let isExpired = new Date() > endDate;
    let isOutDays = membresia.sessionsAmount < 0;
    return !isOutDays || !isExpired
  }
}