import { RequestController } from './../controllers/RequestController';

import { InstructorService } from './InstructorService';
import mongoose, { model } from "mongoose";
import API from "../API";
import { Calendar } from "../model/Calendar";
import { GymSession, GymSessionUniqueDate } from "../model/GymSession";
import { IBaseService } from "./IBaseService";
import { GymDate } from "../model/Date";
import { getDaysBetweenDates } from '../utils/DateUtils';
import { CalendarService } from './CalendarService';

export class SessionService implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ){}

  async create(entity: object): Promise<object> {

    let session : any = entity;
    session.serviceId = new mongoose.mongo.ObjectId(session.serviceId);
    session.dayHour = !session.dayHour ? [] : session.dayHour;
    session.instructorId = new mongoose.mongo.ObjectId(session.instructorId);
    session.available = true;
    
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
    
    let populatedData = await Promise.all(result.map(async (session: any) => {
      let { serviceId, instructorId, ...sessionPart }: any = session;
      sessionPart.service = await API.entityRepository.getOne('services', serviceId);
      sessionPart.instructor = await this.reqControllerRef.instructorService.getOne(instructorId);
      return sessionPart;
    }));
    
    return populatedData;
  }

  public getAvailableAmount(sessionId : string) : Number {
    
    // TODO: get available amount using the reservation service
    return 0;
  }

  public async isNotAllowed(pSession : GymSession, calendarSessions : string[]) : Promise<boolean>{
      let sessionsId = calendarSessions.map(e => e.toString());
      let calendarSessionsObj =  await Promise.all(sessionsId.map(async(sessionId : string) => await this.getOne(sessionId)));

      if (calendarSessionsObj.length == 0)
        return true;

      return calendarSessionsObj.reduce( (acc:boolean, session:any) => {
        
        console.log(session);

        let datesBySession : GymDate = session.dayHour;
        console.log(pSession, 'PSession');
        console.log(datesBySession, 'DatesBySession');

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
    return hour*100 + minutes;
  }

  async addSessionToCalendar(sessionId : string, roomId : string) : Promise<object> {

    let [calendar] : any[] = await this.reqControllerRef.calendarService.get({roomId : new mongoose.mongo.ObjectID(roomId)}, {});
    let calendarId = calendar._id;
    let session : any = await this.getOne(sessionId);
    let sessionByDay : GymSessionUniqueDate[] = session.dayHour.map((dateDayHour:GymDate) => ({...session, dayHour : dateDayHour}));
    
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


      return [...acc, ...sessionsReplicated];
    }, []);


    let firstSession = sessionsWithDates[0];
    let allowed = await this.isNotAllowed(firstSession, calendar.sessions);

    if (allowed) {

      let sessionsWithFullDates : any = sessionsWithDates.map((e:any) => ({...e, dayOfTheWeek : e.dayHour[0]}));
      let creationResult = await Promise.all(sessionsWithFullDates.map(async (session:any) => {
        return await API.entityRepository.create('sessions', session);
      }));

      // update calendar with new sessions
      let {_id, ...calendarWithoutId} = calendar;
      let calendarId = _id;
      calendarWithoutId.sessions = creationResult.map((session:any) => session.insertedId);
      let updatedInfo = await this.reqControllerRef.calendarService.modify(calendarId, calendarWithoutId);

      return {
        message : `Se han agregado las sesiones para todos los dias del mes al calendario`,
        addedSessionAmount : sessionsWithDates.length,
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

  getOne(entityId: string, filter : object = {}, projection = {}): Promise<object> {
    return API.entityRepository.getOne('sessions', entityId, filter, projection);
    }
}