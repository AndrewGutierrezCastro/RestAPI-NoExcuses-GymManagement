import { ObjectId } from "mongoose";
import { Ref } from "./utils";

export interface User {
    username : string,
    password : string,
    role     : string,
    firstName : string,
    lastName : string,
    identification : string,
    email : string,
    phoneNumber : string,
    _id : Ref<ObjectId>,
}