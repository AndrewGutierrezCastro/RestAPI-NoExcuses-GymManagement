import { Schema } from 'mongoose';

export const EnrollmentSchema : Schema = new Schema({
    clienteId : {
        type : Schema.Types.ObjectId,
        required: true
    },
    paymentId : {
        type : Schema.Types.ObjectId,
        required: true,
    },
    creationDate : {
        type :  Schema.Types.String,
        required : true,
    }

});