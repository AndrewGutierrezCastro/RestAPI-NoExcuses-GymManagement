import { Schema } from 'mongoose';

export const ServiceSchema : Schema = new Schema({
    name : {
        type : Schema.Types.String,
        required : true
    },
    description : {
        type : Schema.Types.String,
        required : false,
        default: 'No description'
    }
});