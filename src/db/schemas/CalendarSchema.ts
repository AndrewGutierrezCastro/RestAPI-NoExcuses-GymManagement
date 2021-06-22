import { Schema } from 'mongoose';

export const CalendarSchema : Schema = new Schema({
    roomId : {
        type : Schema.Types.ObjectId,
        required: true
    },
    sessions : {
        type : [Schema.Types.ObjectId],
        required : true,
        default : []
    },
    month : {
        type :  Schema.Types.String,
        required : true,
    },
    year : {
        type : Schema.Types.String,
        required: true,
    },
    published :{
        type : Schema.Types.Boolean,
        required :true,
        default : false
    }
});