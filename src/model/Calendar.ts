import { GymSession } from './GymSession';
export interface Calendar {
    roomId : string,
    sessions : string[],
    month : string,
    year : string,
    published : boolean,
    _id? : string,
}

export interface CalendarWithSessions {
    roomId : string,
    sessions : GymSession[],
    month : string,
    year : string,
    published : boolean,
    _id? : string,
}