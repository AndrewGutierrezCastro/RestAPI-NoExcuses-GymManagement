import { Schema } from 'mongoose';

export const MembershipSchema : Schema = new Schema({
    state : {
        type : Schema.Types.Boolean,
        require: true,
        default: true
    },
    clientId : {
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
    },
    amountDays : {
        type : Schema.Types.Number,
        require: true
    },
    amountSession :{
        type : Schema.Types.Number,
        require :true
    },
    typeMembership :{
        type : Schema.Types.String,
        require : true
    }

});