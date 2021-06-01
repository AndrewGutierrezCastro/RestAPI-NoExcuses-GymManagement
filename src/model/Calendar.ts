import { Session } from "./Session";

export interface Calendar {
    roomId : string,
    sessions : Session[],
    month : string,
    year : string,
    published : boolean,
    _id? : string,
}