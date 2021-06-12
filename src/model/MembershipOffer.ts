
export interface MembershipOffer {
    payment : {
        paymentType : string,
        amount : number,
        date : string,
        subject : string
    },
    creationDate : string,
    amountDays : number,
    amountSession : number,
    typeMembership : string
}