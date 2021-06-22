import { Schema } from 'mongoose';

export const MembershipSchema : Schema = new Schema({
    state : {
        type : Schema.Types.Boolean,
        required: true,
        default: true
    },
    clientId : {
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
    },
    amountDays : {
        type : Schema.Types.Number,
        required: true
    },
    amountSession :{
        type : Schema.Types.Number,
        required :true
    },
    typeMembership :{
        type : Schema.Types.String,
        required : true
    }

});