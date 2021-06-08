import { Schema } from 'mongoose';

export const InstructorSchema : Schema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true
    },
    category : {
        type: Schema.Types.String,
        required : true,
        default : 'Fijo'
    },
    specialities : {
        type : [Schema.Types.ObjectId],
        required : true,
        default : [],
    }
});
