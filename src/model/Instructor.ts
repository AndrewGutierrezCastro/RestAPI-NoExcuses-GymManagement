import { ArrRef, Ref } from './utils';
import { Service } from './Service';
import { User } from './User';
import { ObjectId } from 'mongoose';

export interface Instructor {
    username : string,
    password : string,
    role     : string,
    firstName : string,
    lastName : string,
    pidentification : string,
    email : string,
        phoneNumber : string,
    category : string,
    specialities : ArrRef<Service>,
    _id : Ref<ObjectId>,
}