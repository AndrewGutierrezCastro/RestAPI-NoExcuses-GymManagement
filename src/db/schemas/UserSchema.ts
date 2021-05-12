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
        type : Schema.Types.String,
        required : true
    },
    firstName: {
        type: Schema.Types.String,
        required : true
    }, 
    lastName: {
        type: Schema.Types.String,
        required : true
    },
    identification: {
        type: Schema.Types.String,
        required : true
    },
    email: {
        type: Schema.Types.String,
        required : true
    },
    phoneNumber :  {
        type: Schema.Types.String,
        required : true
    }
});
