import * as mongoose from 'mongoose';

export let Schema = mongoose.Schema;
export type ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

export interface IBaseRepository {
    create(collectionName : string, entity : object) : void;
    modify(collectionName : string, oldEntity : object, newEntity : object) : void;
    delete(collectionName : string, idEntity : mongoose.Schema.Types.ObjectId) : void;
    get(collectionName : string, filter : object, projection : object) : void;
}