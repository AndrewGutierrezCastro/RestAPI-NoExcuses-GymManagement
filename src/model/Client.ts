import { User } from "./User";

export interface Client extends User {
    pendingPayment : string[],
    balance : number,
    memberships : string[]
}