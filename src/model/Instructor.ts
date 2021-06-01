import { Service } from './Service';
import { User } from './User';

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
    specialities : Service[],
    _id?      : string,
}