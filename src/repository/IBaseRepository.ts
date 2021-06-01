import * as mongoose from 'mongoose';

export let Schema = mongoose.Schema;
export type ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

export interface IBaseRepository {
    
    create(collectionName : string, entity : object) : object;

    modify(collectionName : string, oldEntity : object, newEntity : object) : object;

    delete(collectionName : string, idEntity : string) : object;

    get(collectionName : string, filter : object, projection : object) : Promise<object[]>;

}