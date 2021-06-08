export interface Payment {
    paymentType : string,
    amount : number,
    date : Date,
    subject : string,
    _id? : string,
}