import { VisitedClient } from "./patterns/star_assigner/VisitedClient";
import { Visitor } from "./patterns/star_assigner/Visitor";
import { User } from "./User";

export interface Client extends User, VisitedClient {
    pendingPayment : string[],
    balance : number,
    memberships : string[];
    accept(visitor : Visitor) : void;//TODO implement this XD
}

export interface ClientWithoutRef {
    _id? : string,
    userId : string,
    pendingPayment? : string[],
    balance? : number,
    memberships? : string[]
}