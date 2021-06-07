import { Schema } from 'mongoose';

export const ReservationSchema : Schema = new Schema({
    sessionId : {
        type : Schema.Types.ObjectId,
        require: true
    },
    clientId : {
        type : Schema.Types.ObjectId,
        require: true,
    },
    creationDate : {
        type :  Schema.Types.String,
        require : true,
    }

});