import { Date } from "./Date";

export interface GymSession {
    dayHour : Date[],
    instructors : string[],
    serviceId : string,
    available : boolean,
    _id? : string,
}