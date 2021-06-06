import * as mongoose from 'mongoose';

export let Schema = mongoose.Schema;
export type ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

export interface IBaseRepository {
    
    create(collectionName : string, entity : object) : object;

    modify(collectionName : string, oldEntityId : string, newEntity : object) : object;

    delete(collectionName : string, idEntity : string) : object;

    get(collectionName : string, filter : object, projection : object) : Promise<object[]>;

    getOne(collectionName : string, id : string) : Promise<object>;

}