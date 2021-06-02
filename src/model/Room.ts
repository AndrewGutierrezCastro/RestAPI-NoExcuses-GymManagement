import { Calendar } from './Calendar';
import { Date } from './Date';

export interface Room {
    name : string,
    totalCapacity : number,
    allowedCapaocliaty : number,
    weeklySchedule : Date[],
    sessionsCalendar : Calendar,
    _id? : string,
};