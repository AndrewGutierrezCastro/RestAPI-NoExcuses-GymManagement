
export interface User 
{
    _id      : string,
    username : string,
    password : string,
    role     : string,
    sessionTokens : string[]
}