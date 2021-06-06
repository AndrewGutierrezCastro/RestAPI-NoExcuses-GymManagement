import mongoose from "mongoose";
import API from "../API";
import { IBaseService } from "./IBaseService";

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
}