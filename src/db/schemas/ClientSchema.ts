import { Schema } from 'mongoose';

export const ClientSchema : Schema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true
    },
    pendingPayments : {
        type : [Schema.Types.ObjectId],
        required : true,
        default : []
    },
    amount : {
        type : Schema.Types.Decimal128,
        default : 0.00,
        required : true,
    },
    memberShips : {
        type : [Schema.Types.ObjectId],
        default : [],
        required : true,
    },
    favoritesServices : {
        type : [Schema.Types.ObjectId],
        default : [],
        required : true,
    },
    starLevel : {
        type : [Schema.Types.Number],
        default : [],
        required : true,
    },
    notifications : {
        type : [Schema.Types.String],
        default : [],
        required : true,
    }
});

