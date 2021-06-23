import { GymDate } from "./Date";

export interface GymSession {
    dayHour : GymDate[],
    roomId? : string,
    instructorId : string,
    serviceId : string,
    available : boolean,
    weekMode : boolean,
    waitingList : string[],
    _id : string,
}

export interface GymSessionUniqueDate {
    dayHour : GymDate,
    roomId : string,
    instructorId : string,
    serviceId : string,
    available : boolean,
    weekMode : boolean,
    _id? : string,
}