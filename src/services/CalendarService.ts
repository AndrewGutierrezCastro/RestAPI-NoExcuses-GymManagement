import API from "../API";
import { Calendar } from "../model/Calendar";
import { Room } from "../model/Room";
import { IBaseService } from "./IBaseService";
import { RoomService } from "./RoomService";

export class CalendarService implements IBaseService {
  
  constructor(
    private roomService   : RoomService    = new RoomService()
  ) {  }

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
    let room = <Room> await this.roomService.getOne(calendar.roomId);
    calendar.published = true;
    room.monthlyCalendar = calendar;
    await this.roomService.modify(room._id, room);
    
    return {  message: "Calendario publicado con exito",
              success: true,
              object : calendar};

  }
}