export interface Membership {
    state : boolean,
    clientId : string,
    paymentId : string,
    createdDate : Date,
    sessionsAmount : number,
    daysAmount : number,
    _id? : string,
}