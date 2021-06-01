import { ObjectId } from 'mongoose';
import { Calendar } from './Calendar';
import { Date } from './Date';
import { Ref } from './utils';

export interface Room {
    name : string,
    totalCapacity : number,
    allowedCapaocliaty : number,
    weeklySchedule : Date[],
    sessionsCalendar : Ref<Calendar>,
    _id : Ref<ObjectId>,
};