import { Date } from "./Date";

export interface Session {
    calendarId : string,
    dayHour : Date,
    instructors : string[],
    serviceId : string,
    available : boolean,
    _id? : string,
}