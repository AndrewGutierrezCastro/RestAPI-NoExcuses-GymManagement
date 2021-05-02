import mongoose, { Schema } from 'mongoose';

export const UserSchema : Schema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    username: {
        type: Schema.Types.String,
        required : true
    },
    password: {
        type: Schema.Types.String,
        required : true
    },
    sessionTokens: {
        type: Schema.Types.String,
        required : true
    }
});

export interface User 
{
    username : string,
    password : string,
    role     : string,
    sessionTokens : string[]
}