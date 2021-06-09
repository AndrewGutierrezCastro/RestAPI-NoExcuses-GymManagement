import { InstructorService } from './InstructorService';
import mongoose, { model } from "mongoose";
import API from "../API";
import { Calendar } from "../model/Calendar";
import { GymSession } from "../model/GymSession";
import { IBaseService } from "./IBaseService";
import { GymDate } from "../model/Date";
import { getDaysBetweenDates } from '../utils/DateUtils';
import { CalendarService } from './CalendarService';

export class SessionService implements IBaseService {

  constructor(
    private instructorService : InstructorService = new InstructorService(),
    private calendarService : CalendarService = new CalendarService()
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
      sessionPart.instructor = await this.instructorService.getOne(instructorId);
      return sessionPart;
    }));
    
    return populatedData;
  }

  public getAvailableAmount(sessionId : string) : Number {
    
    // TODO: get available amount using the reservation service
    return 0;
  }

  public async isNotAllowed(pSession : GymSession, calendarId : string) : Promise<boolean>{
    let calendar : Calendar = <Calendar> await API.entityRepository.getOne('calendar',calendarId);
    let sessionsIds : string[] = calendar.sessions;//lista de IdSessiones

    let sessions : GymSession[] = await Promise.all(sessionsIds.map(async(id:string) => {
      return <GymSession> await API.entityRepository.getOne('sessions', id);
    }));

    return pSession.dayHour.some( (pNonValidatedDate: GymDate) => {
      let result = false;
      
      sessions.forEach( (session:GymSession) => {

        let datesBySession : GymDate[] = session.dayHour;
        datesBySession.forEach(pValidatedDate => {
          
          let dayOfTheWeek : string = pValidatedDate.dayOfTheWeek;
          result = result || ( pNonValidatedDate.dayOfTheWeek === dayOfTheWeek && this.isBetween(pValidatedDate, pNonValidatedDate));
      
        });
      });
      return result;
    });
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

  async addSessionToCalendar(sessionId : string, calendarId : string) : Promise<object> {

    let session : any = await this.getOne(sessionId);
    let sessionByDay = session.dayHour.map((dateDayHour:GymDate) => ({...session, dayHour : dateDayHour}));
    let sessionsWithDates = sessionByDay.reduce((session:any, acc : object[]) => {
      let datesByDay = getDaysBetweenDates(session.dayHour.dayOfTheWeek);
      let sessionsReplicated = datesByDay.map(date => 
        ({...session, 
          dayHour : { 
            dayOfTheWeek : date, 
            initialHour : session.dayHour.initialHour, 
            finalHour : session.dayHour.finalHour}
        })
      );
      return [...acc, ...sessionsReplicated];
    }, []);

    let [calendarRoom] : any = await this.calendarService.get({roomId:session.roomId}, {});
    let allowed = sessionsWithDates.some((session:any) => this.isNotAllowed(session, calendarRoom._id));

    if (allowed) {

      let creationResult = await Promise.all(sessionsWithDates.map(async (session:any) => {
        return await API.entityRepository.create('sessions', session);
      }));

      // update calendar with new sessions
      let {_id, ...calendarWithoutId} = calendarRoom;
      let calendarId = _id;
      calendarWithoutId.sessions = creationResult.map((session:any) => session.insertedId);
      let updatedInfo = await this.calendarService.modify(calendarId, calendarWithoutId);

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
    return API.entityRepository.getOne('instructor', entityId, filter, projection);
    }
}