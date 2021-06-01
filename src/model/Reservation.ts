import { Client } from "./Client";
import { Session } from "./Session";

export class Reservation {
    constructor(
        public creationDate : string,
        public session : Session,
        public client : Client,
        public _id? : string,
    ) {}
}