import { Schema } from 'mongoose';

export const MontlyCalendarSchema : Schema = new Schema({
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
        default : "January"
    },
    year : {
        type : Schema.Types.String,
        require: true,
        default : "2021"
    },
    posted :{
        type : Schema.Types.Boolean,
        require :true,
        default : false
    }

});