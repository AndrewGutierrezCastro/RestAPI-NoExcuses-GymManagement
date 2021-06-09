import API from "../API";
import { Client } from "../model/Client";
import { Membership } from "../model/Membership";
import { Payment } from "../model/Payment";
import { ClientService } from "./ClientService";
import { IBaseService } from "./IBaseService";
import { PaymentService } from "./PaymenService";

export class MembershipService implements IBaseService {

  constructor(
    private paymentService : PaymentService = new PaymentService(),
    private clientService : ClientService = new ClientService(),
    private membershipService : MembershipService = new MembershipService()
  ){
  }

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
  
  async generateMembership(pPayment : Payment, clientId : string, membershipId : string) : Promise<Object> {
    //Obtener los objetos de la base de datos
    let payment : any = await this.paymentService.create(pPayment);
    let client : any =  await this.clientService.getOne(clientId);
    //Crear la membresia
    let membership : Membership = <Membership> await this.membershipService.getOne(membershipId);

    //agregar el pago pendiente a la lista del cliente
    client.pendingPayment.push(payment.createdObject._id);

    //el cliente modificado
    let client2 : any  = await this.clientService.modify(client._id, client);

    //seter el clientId a la membresia
    membership.clientId = client2.updatedElement._id;
    //obtener la nueva membresia modificada
    let membership2 : any = await this.membershipService.modify(membership._id, membership);

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
}