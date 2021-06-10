import API from "../API";
import { RequestController } from "../controllers/RequestController";
import { InstructorWithoutRef } from "../model/Instructor";
import { IBaseService } from "./IBaseService";

export class InstructorService implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ) {}


  create(entity: object): Promise<object> {
    return API.entityRepository.create('instructor', entity);
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('instructor', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('instructor', entityId);
  }

  async get(filter: object, projection: object): Promise<object[]> {

    let instructors = <InstructorWithoutRef[]> await API.entityRepository.get('instructor', filter, projection );
    
    let filledInstructors = await Promise.all(instructors.map( async(instructor)=> {
        let {userId, ...otherAttrs} : any = instructor;
        let userInfo = await API.entityRepository.getOne('users', userId, {}, {password:0});

        let services = await Promise.all(otherAttrs.specialities.map( async(serviceId:string) => {
            return await API.entityRepository.getOne('services', serviceId);
        }));

        return {_id: otherAttrs._id, user : userInfo, specialities : services, category : otherAttrs.category};
    }));
    
    return filledInstructors;
  }

  async getOne(entityId: string): Promise<object> {
  
    let instructor = await API.entityRepository.getOne('instructor', entityId);
    let {userId, ...otherAttrs} : any = instructor;
    let userInfo = await API.entityRepository.getOne('users', userId, {}, {password:0});

    let services = await Promise.all(otherAttrs.specialities.map( async(serviceId:string) => {
        return await API.entityRepository.getOne('services', serviceId);
    }));

    return {_id: otherAttrs._id, user : userInfo, specialities : services, category : otherAttrs.category};
}
}