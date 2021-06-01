import { ObjectId } from "mongoose";
import { Date } from "./Date";
import { Service } from "./Service";
import { ArrRef, Ref } from "./utils";

export interface Session {
    calendarId : string | null,
    dayHour : Date,
    instructors : string[],
    service : ArrRef<Service>,
    available : boolean,
    _id : Ref<ObjectId>,
}