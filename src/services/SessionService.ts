import mongoose, { model } from "mongoose";
import { Session } from "node:inspector";
import API from "../API";
import { Calendar } from "../model/Calendar";
import { GymSession } from "../model/GymSession";
import { IBaseService } from "./IBaseService";
import { Date } from "../model/Date";

export class SessionService implements IBaseService {

  create(entity: object): Promise<object> {

    let session : any = entity;
    session.serviceId = new mongoose.mongo.ObjectId(session.serviceId);
    session.dayHour = !session.dayHour ? [] : session.dayHour;
    session.instructors = !session.instructors ? [] : session.instructors;
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
      let { serviceId, instructors, ...sessionPart }: any = session;
      sessionPart.service = await API.entityRepository.getOne('services', serviceId);
      sessionPart.instructors = await instructors.map(async (instructorId: string) => await API.entityRepository.getOne('instructors', instructorId));
      return sessionPart;
    }));
    
    return populatedData;
  }

  public getAvailableAmount(sessionId : string) : Number {
    return 0;
  }

  /**
   * dayOfTheWeek : L, K, M, J, V, S, D
   * initialHour : 00:00, 12:00 16:00
   * finalHour : 00:00, 12:00 16:00
   * 
   */

  public async isNotAllowed(pSession : GymSession, calendarId : string) : Promise<boolean>{
    let calendar : Calendar = <Calendar> await API.entityRepository.getOne('calendar',calendarId);
    let sessionsIds : string[] = calendar.sessions;//lista de IdSessiones

    let sessions : GymSession[] = await Promise.all(sessionsIds.map(async(id:string) => {
      return <GymSession> await API.entityRepository.getOne('sessions', id);
    }));
    return pSession.dayHour.some( pNonValidatedDate => {
      let result = false;
      
      sessions.forEach(session => {

        let datesBySession : Date[] = session.dayHour;
        datesBySession.forEach(pValidatedDate => {
          
          let dayOfTheWeek : string = pValidatedDate.dayOfTheWeek;
          result = result || ( pNonValidatedDate.dayOfTheWeek === dayOfTheWeek && this.isBetween(pValidatedDate, pNonValidatedDate));
      
        });
      });
      return result;
    });
  }
  private isBetween(pDateValidated : Date, pDateNonValidatedDate : Date) : boolean {
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

    return hour*100+minutes;


  }

}