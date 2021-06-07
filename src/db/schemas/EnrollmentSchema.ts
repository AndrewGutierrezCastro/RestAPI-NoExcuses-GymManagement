import { Schema } from 'mongoose';

export const EnrollmentSchema : Schema = new Schema({
    clienteId : {
        type : Schema.Types.ObjectId,
        require: true
    },
    paymentId : {
        type : Schema.Types.ObjectId,
        require: true,
    },
    creationDate : {
        type :  Schema.Types.String,
        require : true,
    }

});