import API from "../API";
import { Authenticator } from "../auth/Authenticator";
import { userCollections } from "../auth/UserMapping";
import { RequestController } from "../controllers/RequestController";
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

  constructor(
    private reqControllerRef : RequestController 
  ){}

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
    return API.entityRepository.getOne('users', entityId);
  }

  async get(filter: object, projection: object): Promise<object[]> {
    return [];
  }
}