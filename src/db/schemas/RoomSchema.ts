import { Schema } from 'mongoose';

export const RoomSchema: Schema = new Schema({
    name: {
        type: Schema.Types.String,
        require: true,
        default: "Sala sin nombre"
    },
    capacity: {
        type: Schema.Types.Number,
        require: true,
        default: 10
    },
    allowedCapacity: {
        type: Schema.Types.Number,
        require: true
    },
    semanalSchedule: {
        type: [{
            dayOfTheWeek: {
                type: Schema.Types.String,
                required: true
            },
            initialHour: {
                type: Schema.Types.String,
                required: true
            },
            finalHour: {
                type: Schema.Types.String,
                required: true
            }
        }],
        required: true,
        default: []
    },
    monthlyCalendar: {
        type: Schema.Types.ObjectId,
        require: true
    }

});