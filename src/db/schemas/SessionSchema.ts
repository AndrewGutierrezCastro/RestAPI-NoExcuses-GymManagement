
import { Schema } from 'mongoose';

export const SessionSchema : Schema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    dayHour: {
        type: {
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
        },
        required : true
    },
    serviceId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    instructorId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    available : {
        type : Schema.Types.Boolean,
        required : true,
        default : true
    },
    roomId : {
        type : Schema.Types.String,
        required : true
    },
    waitingList : {
        type : [Schema.Types.String],
        required : true
    }
});

