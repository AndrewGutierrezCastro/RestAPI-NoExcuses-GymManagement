import { Client } from "./Client";
import { Session } from "./Session";

export interface Reservation {
    creationDate : string,
    session : Session,
    client : Client,
    _id? : string,
}