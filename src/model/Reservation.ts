import { Client } from "./Client";


export interface Reservation {
    creationDate : string,
    sessionId : string,
    clientId : string,
    _id? : string,
}