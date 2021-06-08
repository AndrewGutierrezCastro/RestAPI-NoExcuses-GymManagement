import API from "../API";
import { Authenticator } from "../auth/Authenticator";
import { userCollections } from "../auth/UserMapping";
import { User } from "../model/User";
import { IBaseService } from "./IBaseService";

const DEFAULT_USER_PROJECTION = { 
  _id : 1, 
  username: 1, 
  lastName: 1, 
  firstName: 1, 
  email: 1, 
  identification: 1, 
  role: 1, 
  phoneNumber: 1,
};

export class UserService implements IBaseService {

  async create(entity: object): Promise<object> {

    const user = <User> entity;
    const result = await Authenticator.registerUser(user);
    const { _id } = result.newUser;

    const collectionName = userCollections[user.role];

    return API.entityRepository.create(collectionName, entity);
  }

  modify(oldEntityId: string, newEntity: object): Promise<object> {
    return API.entityRepository.modify('users', oldEntityId, newEntity);
  }

  delete(entityId : string) : Promise<object> {
    return API.entityRepository.delete('users', entityId);
  }

  getOne(entityId: string): Promise<object> {
    return API.entityRepository.getOne('instructor', entityId);
  }

  async get(filter: object, projection: object): Promise<object[]> {

    return API.entityRepository.get('users', filter, DEFAULT_USER_PROJECTION);
    // return new Promise(async () => {
    //   let instructors = await API.entityRepository.get('instructors', filter, DEFAULT_USER_PROJECTION);
    //   let clients = await API.entityRepository.get('clients', filter, DEFAULT_USER_PROJECTION);
    //   let administrators = await API.entityRepository.get('administrators', filter, DEFAULT_USER_PROJECTION);

    //   let popInstructors = await Promise.all(instructors.map(async (instructor:any) => {
    //     let { userId, ...attrs } = instructor;
    //     return {...attrs, userInfo : await API.entityRepository.getOne('users', userId)};
    //   }));

    //   let popAdministrators = await Promise.all(clients.map(async (administrator:any) => {
    //     let { userId, ...attrs } = administrator;
    //     let xd = {...attrs, userInfo : await API.entityRepository.getOne('users', userId)};
    //     console.log(xd);
        
    //     return xd
    //   }));

    //   let popClients = await Promise.all(administrators.map(async (client:any) => {
    //     let { userId, ...attrs } = client;
    //     return {...attrs, userInfo : await API.entityRepository.getOne('users', userId)};
    //   }));
      
    //   return [
    //     ...popAdministrators,
    //     ...popInstructors,
    //     ...popClients
    //   ];
    // });
  }
}