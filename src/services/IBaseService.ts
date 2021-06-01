import { ObjectId } from "../repository/IBaseRepository";

export interface IBaseService {
    create(entity : object) : Promise<object>;
    modify(oldEntity : object, newEntity : object) : Promise<object>;
    delete(entityId : string) : Promise<object>;
    get(filter : object, projection : object) : Promise<object[]>;
}