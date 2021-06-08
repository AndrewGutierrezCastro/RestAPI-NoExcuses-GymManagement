import { GymDate } from "./Date";

export interface GymSession {
    dayHour : GymDate[],
    roomId : string,
    instructorId : string,
    serviceId : string,
    available : boolean,
    _id? : string,
}