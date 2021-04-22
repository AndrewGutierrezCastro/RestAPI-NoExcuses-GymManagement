import { IBaseRepository, ObjectId } from "./IBaseRepository";

export class EntityRepository implements IBaseRepository {

    public create(collectionName : string, entity : object) : any {

    }

    public modify(collectionName : string, oldEntity : object, newEntity : object) : any {

    }

    public delete(collectionName : string, idEntity : ObjectId) : any {

    }

    public get(collectionName : string, filter : object) : any[] {
        return [];
    }
}

