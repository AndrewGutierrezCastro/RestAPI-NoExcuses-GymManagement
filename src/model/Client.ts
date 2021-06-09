import { User } from "./User";

export interface Client extends User {
    pendingPayment : string[],
    balance : number,
    memberships : string[]
}

export interface ClientWithoutRef {
    userId : string,
    pendingPayment? : string[],
    balance? : number,
    memberships? : string[]
}