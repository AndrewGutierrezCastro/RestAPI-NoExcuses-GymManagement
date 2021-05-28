import { MongoDbConnection } from './../db/MongoDbConnection';
import { IBaseRepository, ObjectId } from "./IBaseRepository";

export class EntityRepository implements IBaseRepository {

    public EntityRepository() {}

    public async create(collectionName : string, entity : object) : Promise<any> {
        return MongoDbConnection.db.collection(collectionName).insertOne(entity);
    }

    public async modify(collectionName : string, oldEntity : object, newEntity : object) : Promise<any> {
        return MongoDbConnection.db.collection(collectionName).updateOne(oldEntity, newEntity);
    }

    public async delete(collectionName : string, idEntity : ObjectId) : Promise<any> {
        return MongoDbConnection.db.collection(collectionName).deleteOne({_id : idEntity});
    }

    public async get(collectionName : string, filter : object, projection : object) : Promise<any[]> {
        return MongoDbConnection.db.collection(collectionName).find(filter, projection).toArray();
    }

}

