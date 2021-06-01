import { ObjectId } from "mongoose";
import { Ref } from "./utils";

export interface Service {
    name : string,
    description : string,
    _id : Ref<ObjectId>,
}