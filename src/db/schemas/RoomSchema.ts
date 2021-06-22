import { Schema } from 'mongoose';

export const RoomSchema: Schema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        default: "Sala sin nombre"
    },
    capacity: {
        type: Schema.Types.Number,
        required: true,
        default: 10
    },
    allowedCapacity: {
        type: Schema.Types.Number,
        required: true
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
        required: true
    }

});