import mongoose from 'mongoose';
import { MongoDbConnection } from './../db/MongoDbConnection';
import { IBaseRepository } from "./IBaseRepository";

export class EntityRepository implements IBaseRepository {

    public EntityRepository() {}

    public async create(collectionName : string, entity : object) : Promise<object> {
        
        let { 
            insertedId, 
            insertedCount, 
            ops 
        } = await MongoDbConnection.db.collection(collectionName).insertOne(entity);
        
        return {
            insertedCount, 
            createdObject : ops[0],
            insertedId 
        };
    }

    public async modify(collectionName : string, oldEntityId : string, newEntity : object) : Promise<object> {

        let objectId = new mongoose.mongo.ObjectID(oldEntityId);
        let { modifiedCount } = 
            await MongoDbConnection.db.collection(collectionName)
                .updateOne(
                    { _id:objectId}, 
                    { $set: newEntity }
                );

        let updatedElement = await MongoDbConnection.db.collection(collectionName).findOne({_id: objectId});

        return {
            modifiedCount,
            updatedElement
        };
    }

    public async delete(collectionName : string, entityId : string) : Promise<object> {

        let objectId = new mongoose.mongo.ObjectID(entityId);
        let { deletedCount } = await MongoDbConnection.db.collection(collectionName).deleteOne({_id:objectId});

        return { 
            deletedCount, 
            deletedObjectId : (deletedCount || 0) > 0 ? objectId : null 
        };
    }

    public async get(collectionName : string, filter : object, projection : object) : Promise<object[]> {
        return await MongoDbConnection.db.collection(collectionName).find(filter, {projection}).toArray();
    }

    public async getOne(collectionName : string, id : string, filter : object = {}) : Promise<object> {
        return await MongoDbConnection.db.collection(collectionName).findOne({_id : id, ...filter});
    }
}

