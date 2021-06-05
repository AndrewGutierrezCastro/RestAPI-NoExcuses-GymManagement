import { Schema } from 'mongoose';

export const ClientSchema : Schema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true
    },
    pendingPayments : {
        type : [Schema.Types.ObjectId],
        default : []
    },
    amount : {
        type : Schema.Types.Decimal128,
        default : 0.00
    },
    memberShips : {
        type : [Schema.Types.ObjectId],
        default : []
    }
});
