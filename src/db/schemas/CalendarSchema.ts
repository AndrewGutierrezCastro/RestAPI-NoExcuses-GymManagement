import { Schema } from 'mongoose';

export const CalendarSchema : Schema = new Schema({
    roomId : {
        type : Schema.Types.ObjectId,
        require: true
    },
    sessions : {
        type : [Schema.Types.ObjectId],
        required : true,
        default : []
    },
    month : {
        type :  Schema.Types.String,
        require : true,
    },
    year : {
        type : Schema.Types.String,
        require: true,
    },
    published :{
        type : Schema.Types.Boolean,
        require :true,
        default : false
    }
});