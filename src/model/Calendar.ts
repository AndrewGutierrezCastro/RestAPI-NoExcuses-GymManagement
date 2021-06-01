import { ObjectId } from "mongoose";
import { Session } from "./Session";
import { ArrRef, Ref } from "./utils";

export interface Calendar {
    roomId : string,
    sessions : ArrRef<Session>,
    month : string,
    year : string,
    published : boolean,
    _id : Ref<ObjectId>,
}