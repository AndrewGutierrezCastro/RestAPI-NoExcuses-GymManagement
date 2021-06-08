import { GymDate } from "./Date";

export interface GymSession {
    dayHour : GymDate[],
    roomId : string,
    instructors : string[],
    serviceId : string,
    available : boolean,
    _id? : string,
}