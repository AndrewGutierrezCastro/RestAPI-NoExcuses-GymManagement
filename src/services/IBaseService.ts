import { ObjectId } from "../repository/IBaseRepository";

export interface IBaseService {
    create(entity : object) : Promise<boolean>;
    modify(oldEntity : object, newEntity : object) : Promise<boolean>;
    delete(entityId : ObjectId) : Promise<boolean>;
    get(filter : object, projection : object) : Promise<object[]>;
}