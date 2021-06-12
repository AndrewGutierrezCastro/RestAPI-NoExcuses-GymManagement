import mongoose from "mongoose";
import API from "../API";
import { IBaseService } from "./IBaseService";
import { Reservation } from "./../model/Reservation";
import { GymSession, GymSessionUniqueDate } from "./../model/GymSession";
import { RequestController } from '../controllers/RequestController';
import { Client } from "../model/Client";
import { Membership } from "../model/Membership";
import { Room } from "../model/Room";

const previousHours : number= 8;

export class ReservationService implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ){}

  async create(entity: any): Promise<object> {
    /*
    creationDate : string,
    sessionId : string,
    clientId : string,
    _id? : string,
    */
    //set client id
    let clientId : string = entity.clientId;
    //get client
    let client : Client = <Client> await this.reqControllerRef.clientService.getOne(clientId);
    //get membership
    let responseActiveMembership : any = await this.reqControllerRef.membershipService.hasActiveMembership(clientId);
    let activeMembership = <Membership> responseActiveMembership.object;

    //Revisar si puede reservar
    let responseCanReservate : any = await this.canReservate(entity);
    if(!responseCanReservate.success){
      //Si no puede reservar entonces retornar ese mensaje
      return responseCanReservate;
    }
    let responseReservation : any = await API.entityRepository.create('reservation', entity);
    let reservation : Reservation = responseReservation.createdObject;
    //Aplicar la membresia y quitarle al cantidad de sesiones de ser necesario
    this.reqControllerRef.membershipService.applyMembership(activeMembership._id);

    return {message : `Se ha creado la reservacion al cliente ${client.firstName} ` + responseCanReservate.message,
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
    let reservation = <Reservation> await this.getOne(reservationId);
    let session  = <GymSession> await this.reqControllerRef.sessionService.getOne(reservation.sessionId);
    //respuesta del reembolo o del cargo
    let responseRefund : any;
    if(this.isReservationRefund(reservation, session)){
      responseRefund = this.reqControllerRef.membershipService.refund(reservation.clientId);
      //eliminar la session
      let responseReservation = await this.delete(reservationId);
      //console.log(responseReservation);
      return responseRefund;
    }else{
      return {  message : "No se ha efectuado el reembolso por normas de cancelacion",
              success : false,
              object  : {}
            };
    }

    
  } 

  private isReservationRefund(reservation : Reservation, session : GymSession) : boolean{
    //obtener las horas y minutos en formato de string
    let [h,m] = session.dayHour[0].initialHour.split(':');
     //crear un Date, con la fecha de esa session
    let eightPreviousHoursSession = new Date(session.dayHour[0].dayOfTheWeek);
    //Setear las hours y los minutos
    eightPreviousHoursSession.setHours((parseInt(h)-previousHours));
    eightPreviousHoursSession.setMinutes(parseInt(m));

    //Obtener el date de la creacion de la reservation
    let reservationDate = new Date(reservation.creationDate);
    return reservationDate < eightPreviousHoursSession ;
  }

  private async canReservate(reservation : any) : Promise<object>{
    /*
    creationDate : string,
    sessionId : string,
    clientId : string,
    _id? : string,
    */
    let clientId = reservation.clientId;
    let sessionId = reservation.sessionId;
    //revisar si existe reservaciones disponibles, cupos.
    let responseQuoat : any = await this.isThereQuota(sessionId);
    //console.log("Quoat: ", responseQuoat);
    //Revisar si el cliente puede reservar
    let responseItsAllowedToReserve : any = await this.reqControllerRef.membershipService.itsAllowedToReserve(clientId);
    //console.log("ItsAllowedToReserve: ", responseItsAllowedToReserve);
    //Mensaje de exito
    let successMessage = "Puede reservar, hay cupo y el cliente tiene permitido reservar.";
    let canReservate = responseQuoat.success && responseItsAllowedToReserve.success;
    //En caso de incumplir alguna de las dos mostrar la que incumplio
    let errorMessage = responseQuoat.success ? responseItsAllowedToReserve.message : responseQuoat.message;
    //Ver si ambas no cumplen
    let isNotQuoatAndIsNotAllowedToReserve = !responseQuoat.success && !responseItsAllowedToReserve.success;
    //De no cumplir las dos entonces concatenar los mensajes
    errorMessage = isNotQuoatAndIsNotAllowedToReserve ? responseItsAllowedToReserve.message + " y " + responseQuoat.message : errorMessage;
    //Si puede reservar mostrar el mensaje de exito, sino el de error y agregar si se puede reservar o no
    return  {message : canReservate ? successMessage :  errorMessage,
             success : canReservate
    };

  }

  private async isThereQuota(pSessionId : string) : Promise<object>{
    //Resivar si la session tiene cupo
    let session = <GymSessionUniqueDate> await this.reqControllerRef.sessionService.getOne(pSessionId);
    let roomId = session.roomId;
    let room = <Room> await this.reqControllerRef.roomService.getOne(roomId);
    let allowedCapacity = room.allowedCapacity;
    //obtener la cantidad de reservaciones para una session
    let reservationsAmount = await this.reqControllerRef.sessionService.getAvailableAmount(pSessionId);
    //Revisar si queda almenos un cupo
    let canReserve = reservationsAmount < allowedCapacity;
    //dar mensaje que no quedan mas cupos
    return {message : canReserve ? "Aun existen cupos para reservar en la session indicada" : "No existen mas cupos para la session indicada",
              success : canReserve};
  }

   async getReservationByClient(clientId : string) : Promise<object> {

    let id = new mongoose.mongo.ObjectId(clientId);
    let reservations = await this.reqControllerRef.reservationService.get({clientId : id}, {});

    let populatedReservations = reservations.map(async(reservation : any) => {

      let clientId = reservation.clientId;
      let sessionId = reservation.sessionId;
      let creationDate = reservation.creationDate;

      let sessionObj = await this.reqControllerRef.sessionService.getOne(sessionId)
      let clientObj = await this.reqControllerRef.clientService.getOne(clientId);

      return {
        session : sessionObj,
        client : clientObj,
        creationDate,
        _id : reservation._id
      };
    });

    return populatedReservations;
  }
   
}