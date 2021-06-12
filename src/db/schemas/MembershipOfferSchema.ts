import { Schema } from 'mongoose';

export const MembershipOfferSchema : Schema = new Schema({
    payment : {
        type:{ 
            paymentType : {
                type : Schema.Types.String,
                required: true,
                default: "Transferencia"
            },
            amount : {
                type : Schema.Types.Decimal128,
                required: true,
                default : 0.00
            },
            date : {
                type : Schema.Types.String,
                required: true,
                default : "No day setted"
            },
            subject : {
                type :  Schema.Types.String,
                required : true,
                default : "Pago sin motivo"
            },
        },
        required: true,
        
    },
    creationDate : {
        type :  Schema.Types.String,
        required : true,
    },
    amountDays : {
        type : Schema.Types.Number,
        required : true
    },
    amountSession :{
        type : Schema.Types.Number,
        required : true
    },
    typeMembership :{
        type : Schema.Types.String,
        required : true
    }
});