import { Session } from "node:inspector";
import API from "../API";
import { IBaseService } from "./IBaseService";
import { Reservation } from "./../model/Reservation";
import { GymSessionUniqueDate } from "./../model/GymSession";
import { ClientService } from "./ClientService";

const previousHours : number= 8;

export class ReservationService implements IBaseService {


  constructor(
    private reservationService : ReservationService = new ReservationService(),
    private clientService : ClientService = new ClientService()
  ){}

  create(entity: object): Promise<object> {
    return API.entityRepository.create('reservation', entity);
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
    let session : any = await this.reservationService.getOne(reservation.sessionId);
    //respuesta del reembolo o del cargo
    let response : any;
    if(this.isReservationRefund(reservation, session)){
      //generar un reembolso al cliente
      response = await this.clientService.refund(reservation.clientId);
      return {  message : "Se hizo un reembolso a su favor",
              success : true,
              object  : response
            };
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