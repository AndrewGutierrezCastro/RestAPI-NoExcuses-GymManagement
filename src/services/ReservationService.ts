
import API from "../API";
import { IBaseService } from "./IBaseService";
import { Reservation } from "./../model/Reservation";
import { GymSessionUniqueDate } from "./../model/GymSession";
import { RequestController } from '../controllers/RequestController';
import { Client } from "../model/Client";
import { Membership } from "../model/Membership";

const previousHours : number= 8;

export class ReservationService implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ){}

  async create(entity: any): Promise<object> {
    //set client id
    let clientId : string = entity.clientId;
    //get client
    let client : Client = <Client> await this.reqControllerRef.clientService.getOne(clientId);
    //get membership
    let responseActiveMembership : any = await this.reqControllerRef.membershipService.hasActiveMembership(clientId);
    let activeMembership = <Membership> responseActiveMembership.object;

    //Revisar si puede reservar
    let responseIsAllowedToReserve : any = await this.reqControllerRef.membershipService.itsAllowedToReserve(clientId) 
    if(!responseIsAllowedToReserve.success){
      //Si no puede reservar entonces retornar ese mensaje
      return responseIsAllowedToReserve;
    }
    let responseReservation : any = await API.entityRepository.create('reservation', entity);
    let reservation : Reservation = responseReservation.createdObject;
    let sessionId = reservation.sessionId;
    //Aplicar la membresia y quitarle al cantidad de sesiones de ser necesario
    this.reqControllerRef.membershipService.applyMembership(activeMembership._id);

    return {message : `Se ha creado la reservacion al cliente ${client.firstName}`,
            success : true,
            object : reservation
            };
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

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('reservation', entityId);
    }

  async cancelReservation(reservationId : string) : Promise<Object>{
    //obtener la reservacion y la reservacion
    let reservation : any = await this.getOne(reservationId);
    let session : any = await this.getOne(reservation.sessionId);
    //respuesta del reembolo o del cargo
    let responseRefund : any;
    if(this.isReservationRefund(reservation, session)){
      responseRefund = this.reqControllerRef.membershipService.refund(reservation.clientId);
      /*
       return{message : "Se ha hecho un reembolso a su cuenta",
              success : true,
              object  : null
            };
      */
      return responseRefund;
    }else{
      return {  message : "No se ha efectuado el reembolso por normas de cancelacion",
              success : false,
              object  : {}
            };
    }

    
  } 

  private isReservationRefund(reservation : Reservation, session : GymSessionUniqueDate) : boolean{
    //obtener las horas y minutos en formato de string
    let [h,m] = session.dayHour.initialHour.split(':');
     //crear un Date, con la fecha de esa session
    let eightPreviousHoursSession = new Date(session.dayHour.dayOfTheWeek);
    //Setear las hours y los minutos
    eightPreviousHoursSession.setHours((parseInt(h)-previousHours));
    eightPreviousHoursSession.setMinutes(parseInt(m));

    //Obtener el date de la creacion de la reservation
    let reservationDate = new Date(reservation.creationDate);
  
    return reservationDate < eightPreviousHoursSession ;
  }


}