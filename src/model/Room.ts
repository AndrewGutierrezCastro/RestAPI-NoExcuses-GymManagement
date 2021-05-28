import { Calendar } from './Calendar';
import { Date } from './Date';

export class Room {
    constructor(
    public name : string,
    public totalCapacity : number,
    public allowedCapaocliaty : number,
    public weeklySchedule : Date[],
    public sessionsCalendar : Calendar,
    public _id? : string,
    ) {}
}