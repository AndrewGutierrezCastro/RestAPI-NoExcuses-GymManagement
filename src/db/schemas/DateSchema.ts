import { Schema } from 'mongoose';

export const DateSchema : Schema = new Schema({
    dayOfTheWeek : {
        type : Schema.Types.String,
        required : true
    },
    initialHour : {
        type : Schema.Types.String,
        required : true
    },
    finalHour : {
        type : Schema.Types.String,
        required : true
    }
})