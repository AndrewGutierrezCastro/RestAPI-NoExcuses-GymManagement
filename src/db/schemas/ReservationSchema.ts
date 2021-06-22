import { Schema } from 'mongoose';

export const ReservationSchema : Schema = new Schema({
    sessionId : {
        type : Schema.Types.ObjectId,
        required: true
    },
    clientId : {
        type : Schema.Types.ObjectId,
        required: true,
    },
    creationDate : {
        type :  Schema.Types.String,
        required : true,
    }

});