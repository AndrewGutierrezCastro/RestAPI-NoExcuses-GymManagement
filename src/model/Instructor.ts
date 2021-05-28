import { Service } from './Service';
import { User } from './User';

export class Instructor extends User {

    constructor(
        public username : string,
        public password : string,
        public role     : string,
        public firstName : string,
        public lastName : string,
        public identification : string,
        public email : string,
        public phoneNumber : string,
        public category : string,
        public specialities : Service[],
        public _id?      : string,
    ) {
        super(username, password, role, firstName, lastName, identification, email, phoneNumber, _id);
    }
}