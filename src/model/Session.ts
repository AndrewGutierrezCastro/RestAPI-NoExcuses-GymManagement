import { Date } from "./Date";
import { Service } from "./Service";

export class Session {
    constructor(
        public calendarId : string,
        public dayHour : Date,
        public instructors : string[],
        public service : Service,
        public available : boolean,
        public _id : string = 'null',
    ) {}
}