import API from "../API";
import { Calendar, CalendarWithSessions } from "../model/Calendar";
import { Room } from "../model/Room";
import { IBaseService } from "./IBaseService";
import mongoose from "mongoose";
import { RequestController} from '../controllers/RequestController';
import { FilterStrategy } from "../model/patterns/calendar_filters/FilterStrategy";
import { GymSessionUniqueDate, GymSession} from "../model/GymSession";
import { FilterByInstructor } from "../model/patterns/calendar_filters/FilterByInstructor";
import { FilterByService } from "../model/patterns/calendar_filters/FilterByService";
import { FilterByDate } from "../model/patterns/calendar_filters/FilterByDate";
import { FilterByMonth } from "../model/patterns/calendar_filters/FilterByMonth";

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export class CalendarService implements IBaseService {
  
  constructor(
    private reqControllerRef : RequestController,
    private filterStrategy: FilterStrategy
  ) {  }

  private setStrategy(pStrategyMode: number) {
    switch(pStrategyMode){
      case 0:
      this.filterStrategy = new FilterByInstructor();
        break;
      case 1:
        this.filterStrategy = new FilterByDate();
        break;
      case 2:
        this.filterStrategy = new FilterByMonth();
        break;
      case 3:
        this.filterStrategy = new FilterByService();
        break;
    }
  }

  async filterCalendar(roomId : string, filter : any) :  Promise<CalendarWithSessions | object> {
    let calendar = <CalendarWithSessions> await this.getCalendarByRoom(roomId);
    let sessions : GymSession[] = calendar.sessions;
    this.setStrategy(filter.strategyMode);

    let sessionsObjs = this.filterStrategy.filter(sessions, filter);
    let calendarWithSessions : any = 
      {...calendar, success: true, sessions: sessionsObjs, month : monthNames[new Date().getMonth()]};

    return calendarWithSessions;

  }

  create(entity: object): Promise<object> {
    return API.entityRepository.create('calendar', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('calendar', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('calendar', entityId);
  }

  get(filter: object, projection: object): Promise<object[]> {
    return API.entityRepository.get('calendar', filter, projection);
  }

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('calendar', entityId);
    }

  public async publishCalendar (calendarId : string) : Promise<object> {

    let calendar =  <Calendar> await this.getOne(calendarId);

    if (calendar.published) 
      return { 
        message: "El calendario de este mes ya ha sido publicado",
        success: false,
        object : calendar
      }; 

    let room = <Room> await this.reqControllerRef.roomService.getOne(calendar.roomId);
    calendar.published = true;
    room.monthlyCalendar = calendar;
    let modifyCalendar = await this.modify(calendar._id, calendar);
    await this.reqControllerRef.roomService.modify(room._id, room);
    
    return {  
      message: "Calendario publicado con exito",
      success: true,
      object : modifyCalendar
    };
  }

  async getCalendarByRoom(roomId : string) : Promise<CalendarWithSessions | object> {

    let [calendar]  = 
      <Calendar[]> await this.get(
        { roomId : new mongoose.mongo.ObjectId(roomId), 
          month : new Date().getMonth().toString(),
          year : new Date().getFullYear().toString(),
          published : true}, {});

    if (!calendar)  
      return {
        message : `Calendario oficial de la sala para el mes ${monthNames[new Date().getMonth()]} aun no se ha publicado`,
        success : false,
        monthName : new Date().getMonth()
      }

    let sessions : string[] = calendar.sessions;

    if (!sessions || sessions.length === 0)
      return [];

    let sessionsObjs = <any[]> await Promise.all(sessions.map(async (sessionId: string) => {
      return await this.reqControllerRef.sessionService.getOne(sessionId);
    }));


    let now = new Date();
    
    sessionsObjs = sessionsObjs.filter((session:any) => {
      let sessionDate = session.dayOfTheWeek.dayOfTheWeek;
      let d = new Date(sessionDate);  
      return d > now;
    });

    let calendarWithSessions : any = 
      {...calendar, success: true, sessions: sessionsObjs, month : monthNames[new Date().getMonth()]};

    return calendarWithSessions;
  }
}