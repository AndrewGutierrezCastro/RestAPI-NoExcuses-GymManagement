import { Schema } from 'mongoose';

export const AdministratorSchema : Schema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true
    },
});
