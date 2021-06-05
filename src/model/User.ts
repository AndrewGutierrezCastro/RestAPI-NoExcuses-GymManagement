
export interface User {
    username : string,
    password : string,
    role     : string,
    firstName : string,
    lastName : string,
    identification : string,
    email : string,
    phoneNumber : string,
    category? : string,
    specialities? : string[],
    _id?      : string
}