import { Client } from "./Client";
import { Session } from "./GymSession";

export interface Reservation {
    creationDate : string,
    sessionId : string,
    clientId : string,
    _id? : string,
}