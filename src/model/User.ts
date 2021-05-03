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
    role : {
        type : Schema.Types.String
    }
});

export interface User 
{
    username : string,
    password : string,
    role     : string,
    sessionTokens : string[]
}