import { ObjectId } from './../repository/IBaseRepository';
import API from "../API";
import { Calendar, CalendarWithSessions } from "../model/Calendar";
import { Room } from "../model/Room";
import { IBaseService } from "./IBaseService";
import mongoose from "mongoose";
import { GymSession } from '../model/GymSession';
import { RequestController} from '../controllers/RequestController';

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export class CalendarService implements IBaseService {
  
  constructor(
    private reqControllerRef : RequestController
  ) {}

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