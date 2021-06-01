import { ObjectId } from "mongoose";
import { Client } from "./Client";
import { Session } from "./Session";
import { Ref } from "./utils";

export interface Reservation {
    creationDate : string,
    session : Ref<Session>,
    client : Ref<Client>,
    _id : Ref<ObjectId>,
}