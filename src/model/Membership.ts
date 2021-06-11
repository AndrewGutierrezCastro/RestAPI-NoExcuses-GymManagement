export interface Membership {
    state : boolean,
    clientId : string,
    paymentId : string,
    createdDate : Date,
    sessionsAmount : number,
    daysAmount : number,
    typeMembership : string,
    _id? : string,
}