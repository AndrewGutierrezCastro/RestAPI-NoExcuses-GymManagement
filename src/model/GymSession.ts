import { GymDate } from "./Date";

export interface GymSession {
    dayHour : GymDate[],
    instructorId : string,
    serviceId : string,
    available : boolean,
    _id? : string,
}