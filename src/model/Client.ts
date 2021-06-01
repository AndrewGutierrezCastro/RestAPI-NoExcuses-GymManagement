import { ObjectId } from "mongoose";
import { Ref } from "./utils";

export interface Client {
    pendingPayment : string[],
    balance : number,
    _id : Ref<ObjectId>,
}