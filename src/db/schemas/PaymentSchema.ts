import { Schema } from 'mongoose';

export const PaymentSchema : Schema = new Schema({
    paymentType : {
        type : Schema.Types.String,
        require: true,
        default: "Sinpe"
    },
    amount : {
        type : Schema.Types.Decimal128,
        require: true,
        default : 0.00
    },
    date : {
        type : Schema.Types.String,
        require: true,
        default : "No day setted"
    },
    subject : {
        type :  Schema.Types.String,
        require : true,
        default : "Pago sin motivo"
    }

});