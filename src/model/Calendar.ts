import { Session } from "./Session";

export class Calendar {
    constructor(
        public _id : string,
        public roomId : string,
        public sessions : Session[],
        public month : string,
        public year : string,
        public published : boolean
    ) {}
}