
import { Schema } from 'mongoose';

export const SessionSchema : Schema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    dayHour: {
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
    serviceId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    instructors : {
        type : [Schema.Types.ObjectId],
        required : true,
    },
    available : {
        type : Schema.Types.Boolean,
        required : true
    }
});
        
