import API from "../API";
import { Authenticator } from "../auth/Authenticator";
import { RequestController } from "../controllers/RequestController";
import { Instructor, InstructorWithoutRef } from "../model/Instructor";
import { IBaseService } from "./IBaseService";

export class InstructorService implements IBaseService {

  constructor(
    private reqControllerRef : RequestController 
  ) {}


  async create(entity: object): Promise<object> {

    let instructor = <Instructor> entity;
    let responseCreatedUser = await Authenticator.registerUser(instructor); 

    if (!responseCreatedUser.newUser)
      return responseCreatedUser;

    let createdUser = responseCreatedUser.newUser;
    let newInstructor : InstructorWithoutRef = {
      userId : createdUser._id,
      category : '',
      specialities : []
    };

    let responseCreatedClient = await API.entityRepository.create('instructor', newInstructor);

    return {  
      message : "El instructor se ha creado exitosamente",
      success: true,
      object : responseCreatedClient
    };
  }
  
  modify(oldEntityId: string = '', newEntity: object): Promise<object> {
    return API.entityRepository.modify('instructor', oldEntityId, newEntity);
  }

  async delete(entityId : string) : Promise<object> {

    let instructor : any = await this.getOne(entityId);
    let userId = instructor.userId;
    let _ = await this.reqControllerRef.userService.delete(userId);

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