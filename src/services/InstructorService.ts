import API from "../API";
import { InstructorWithoutRef } from "../model/Instructor";
import { IBaseService } from "./IBaseService";

export class InstructorService implements IBaseService {

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
        let {userId, ...otherAttrs} = instructor;
        let userInfo = await API.entityRepository.getOne('users', userId);

        let services = await Promise.all(otherAttrs.specialities.map( async(serviceId) => {
            return await API.entityRepository.getOne('services', serviceId);
        }));

        return {user : userInfo, specialities : services, category : otherAttrs.category};
    }));
    
    return filledInstructors;
  }
}