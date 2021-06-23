
import mongoose from "mongoose";
import API from "../API";
import { WaitingListUpdater } from './../model/patterns/waiting_list-reward_checker/WaitingListUpdater';
import { RequestController } from './../controllers/RequestController';
import { GymSession, GymSessionUniqueDate } from "../model/GymSession";
import { IBaseService } from "./IBaseService";
import { GymDate } from "../model/Date";
import { getDaysBetweenDates } from '../utils/DateUtils';
import { Reservation } from '../model/Reservation';
import { Room } from '../model/Room';

export class SessionService implements IBaseService,WaitingListUpdater {

  constructor(
    private reqControllerRef : RequestController 
  ){}

  async create(entity: object): Promise<object> {

    let session : any = entity;
    session.serviceId = new mongoose.mongo.ObjectId(session.serviceId);
    session.dayHour = !session.dayHour ? [] : session.dayHour;
    session.instructorId = new mongoose.mongo.ObjectId(session.instructorId);
    session.available = true;
    session.weekMode = !session.weekMode ? true : session.weekMode;
    session.waitingList = [];
    
    return API.entityRepository.create('sessions', session);
  }

  modify(oldEntityId: string, newEntity: object): Promise<object> {
    return API.entityRepository.modify('sessions', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('sessions', entityId);
  }

  async get(filter: object, projection: object): Promise<object[]> {
    const result = await API.entityRepository.get('sessions', filter, projection);   
    return result;
  }

  async getCompleted(filter: object, projection: object): Promise<object[]> {

    const result = await API.entityRepository.get('sessions', {...filter, weekMode : true}, projection);
    
    let populatedData = await Promise.all(result.map(async (session: any) => {
      let { serviceId, instructorId, ...sessionPart }: any = session;
      sessionPart.service = await this.reqControllerRef.serviceService.getOne(serviceId);
      sessionPart.instructor = await this.reqControllerRef.instructorService.getOne(instructorId);
      return sessionPart;
    }));  
    
    return populatedData;
  }

  public async getAvailableAmount(pSessionId : string) : Promise<number> {
    
    let reservations : Reservation[] =  <Reservation[]> await this.reqControllerRef.reservationService.get({sessionId : pSessionId}, {});
    //Revisar si queda almenos un cupo
    return reservations.length;
  }

  public async isNotAllowed(pSession : GymSession, calendarSessions : string[]) : Promise<boolean>{
      let sessionsId = calendarSessions.map(e => e.toString());
      let calendarSessionsObj =  await Promise.all(sessionsId.map(async(sessionId : string) => await this.getOne(sessionId)));

      if (calendarSessionsObj.length == 0)
        return true;

      console.log('CALENDARSESSIONS', calendarSessionsObj);

      return calendarSessionsObj.reduce( (acc:boolean, session:any) => {
  
        let datesBySession : GymDate = session.dayHour;
        return acc || datesBySession.dayOfTheWeek === pSession.dayHour[0].dayOfTheWeek && this.isBetween(datesBySession, pSession.dayHour[0]);
      }, false);
  }

  private isBetween(pDateValidated : GymDate, pDateNonValidatedDate : GymDate) : boolean {
    let inicial1 : number = this.getHourAsNumber(pDateValidated.initialHour);
    let final1 : number = this.getHourAsNumber(pDateValidated.finalHour);

    let inicial2 : number = this.getHourAsNumber(pDateNonValidatedDate.initialHour);
    let final2 : number = this.getHourAsNumber(pDateNonValidatedDate.finalHour);

    return inicial1 > inicial2 && inicial1 < final2 ||
           final1   > inicial2 && final1   < final2;
  }

  private getHourAsNumber(pHour : string) : number {
    let [h, m] = pHour.split(':');
    let hour : number = parseInt(h);
    let minutes : number = parseInt(m);
    return hour * 100 + minutes;
  }

  async addSessionToCalendar(sessionId : string, roomId : string) : Promise<object> {

    let [calendar] : any[] = await this.reqControllerRef.calendarService.get({roomId : new mongoose.mongo.ObjectID(roomId)}, {});
    let [session] : any = await this.get({_id: new mongoose.mongo.ObjectID(sessionId)}, {});
    let sessionByDay : GymSessionUniqueDate[] = session.dayHour.map((dateDayHour:GymDate) => ({...session, dayHour : dateDayHour}));
    
    let minimalSessions : GymSession[] = [];
    let sessionsWithDates : any = sessionByDay.reduce((acc : object[], session:any) => {
      let {_id, ...sessionWithoutId} = session;
      let datesByDay = getDaysBetweenDates(session.dayHour.dayOfTheWeek);
      let sessionsReplicated = datesByDay.map(date => 
        ({...sessionWithoutId, 
          dayHour : [{ 
            dayOfTheWeek : date, 
            initialHour : session.dayHour.initialHour, 
            finalHour : session.dayHour.finalHour}]
        })
      );
      minimalSessions.push(sessionsReplicated[0]);
      return [...acc, ...sessionsReplicated];
    }, []);

    let allowed = 
      calendar.sessions.length === 0 ||!minimalSessions.some(async(session:any) => {
        return (await this.isNotAllowed(session, calendar.sessions));
      });

    if (allowed) {

      let sessionsWithFullDates : any = sessionsWithDates.map((e:any) => ({...e, dayOfTheWeek : e.dayHour[0]}));
      let creationResult = await Promise.all(sessionsWithFullDates.map(async (session:any) => {
        session.weekMode = false;
        session.roomId = roomId;
        return await API.entityRepository.create('sessions', session);
      }));

      // update calendar with new sessions
      let {_id, ...calendarWithoutId} = calendar;
      let calendarId = _id;
      calendarWithoutId.sessions = [
        ...calendar.sessions,
        ...creationResult.map((session:any) => session.insertedId)
      ];
      calendarWithoutId.published = true;

      let updatedInfo = await this.reqControllerRef.calendarService.modify(calendarId, calendarWithoutId);

      return {
        message : `Se han agregado las sesiones para todos los dias del mes al calendario`,
        addedSessionAmount : sessionsWithFullDates.length,
        success : true
      };

    }
    else {
      return {
        message : `No se pudo agregar la session al calendario de la sala, ya que existe al menos una sesion en el mismo horario semanal`,
        success : false
      }
    }

  }

  async getOne(entityId: string, filter : object = {}, projection = {}): Promise<object> {

    let session : any = await API.entityRepository.getOne('sessions', entityId, filter, projection);
    // console.log('id', entityId);
    // console.log(session);
    let { serviceId, instructorId, ...sessionPart }: any = session;

    sessionPart.service = await this.reqControllerRef.serviceService.getOne(serviceId);
    sessionPart.instructor = await this.reqControllerRef.instructorService.getOne(instructorId);
    return sessionPart;
  }

  async getClientsBySession(sessionId : string) : Promise<object>{
    //Obtener todas las reservaciones de esa session
    let reservationsOfTheSession = await this.reqControllerRef.reservationService.get({sessionId}, {}  );
    //Obtener los objetos cliente que tienen reservacion para esa session
    let populateClients = await Promise.all(reservationsOfTheSession.map(async(reservation : any) => {
        let clientId = reservation.clientId;
        let clientObj = await this.reqControllerRef.clientService.getClientWithAllInfo(clientId);
        return clientObj;
        }
      )
    );
    
    //Obtener la informacion del aforo y la capacitdad total
    let gymSession = <GymSessionUniqueDate> await this.getOne(sessionId);
    let room = <Room> await this.reqControllerRef.roomService.getOne( gymSession.roomId );
    let cantidadMaximaReservaciones = room.capacity / (100 / room.allowedCapacity);
        
    return {  clients : populateClients,
              aforoSesion : room.allowedCapacity, 
              cantidadSala : room.capacity,                 
              cantidadMaximaReservaciones : cantidadMaximaReservaciones,  
              cantidadReservaciones : reservationsOfTheSession.length,
              cupoDisponible : cantidadMaximaReservaciones - reservationsOfTheSession.length
    };
  }

  async update(sesionObj: object): Promise<void> {

    let sesion = <GymSession> sesionObj;
    
    // buscamos si hay algun cliente en espera, si hay al menos uno
    // en la cola de espera, se agrega al primero de ellos

    if (sesion.waitingList?.length > 0) 
    {
      let clientId = <string> sesion.waitingList?.shift();
      
      // creamos una reservacion para el primer cliente de la lista de espera
      let reservation : Reservation = {
        creationDate : new Date().toString(),
        clientId,
        sessionId : sesion?._id
      };

      let reservationInfo : any = await this.reqControllerRef.reservationService.create(reservation);

      // una vez se intenta reservar con el cliente en la lista de espera
      // se notifica al usuario de lo sucedido

      let notification = 
        reservationInfo.success 
          ? `Haz salido de la lista de espera y ahora te encuentras registrado para participar de la sesion: Detalles: ${reservationInfo.message}`
          : `Se ha intentado reservar a su nombre en la sesion pero no se ha logrado. Detalles : ${reservationInfo.message}`;

      this.reqControllerRef.clientService.addNotification(clientId, notification);
    }
    else {
      // si no hay nadie en la lista de espera... nada que hacer :)
    }
  }

  async enqueueWaitingList(sessionId : string, clientId : string) : Promise<object> {

    let {_id, ...sessionWithoutId}  = <GymSession> await this.getOne(sessionId);
    if (!sessionWithoutId.waitingList)
    {
      sessionWithoutId.waitingList = [];
    }

    sessionWithoutId.waitingList.push(clientId); // poner al cliente al final de la cola para la sesion deseada
    let sInfo : any = await this.modify(_id, sessionWithoutId);

    if (sInfo.modifiedCount > 0)
    {
      return {
        sucess : true,
        message : `Has sido agregado al final de la lista de espera de la sesion, eres el numero ${sessionWithoutId.waitingList.length + 1} seras agregado una vez se libere el campo`
      };
    }
    else 
    {
      return {
        sucess : false,
        message : `No has sido agregado al final de la lista de espera de la sesion`
      };
    }
  }
}