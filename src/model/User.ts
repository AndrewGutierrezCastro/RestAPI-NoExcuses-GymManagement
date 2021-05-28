
export class User 
{
    constructor(
        public username : string,
        public password : string,
        public role     : string,
        public firstName : string,
        public lastName : string,
        public identification : string,
        public email : string,
        public phoneNumber : string,
        public _id?      : string
    ){}
}