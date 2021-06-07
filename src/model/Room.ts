import { Calendar } from './Calendar';
import { GymDate } from './Date';

export interface Room {
    name : string,
    capacity : number,
    allowedCapacity : number,
    weeklySchedule : GymDate[],
    sessionsCalendarId? : Calendar,
    _id? : string,
};