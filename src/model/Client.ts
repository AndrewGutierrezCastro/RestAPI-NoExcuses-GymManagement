import { VisitedClient } from "./patterns/star_assigner/VisitedClient";
import { Visitor } from "./patterns/star_assigner/Visitor";
import { Service } from "./Service";
import { User } from "./User";

export class Client implements User, VisitedClient {
    username: string = "";
    password: string = "";
    role: string = "";
    firstName: string = "";
    lastName: string = "";
    identification: string = "";
    email: string = "";
    phoneNumber: string = "";
    _id?: string  = "";
    pendingPayment: string[] = [];
    balance: number = 0;
    memberships: string[] = [];
    favoritesServices : Service[] = [];
    starLevel : number[] = [];
    notifications : string[] = [];
    accept(visitor : Visitor) : void{
        visitor.visite(this);
    }
}

export interface ClientWithoutRef {
    _id? : string,
    userId : string,
    pendingPayment? : string[],
    balance? : number,
    memberships? : string[],
    favoritesServices : string[],
    starLevel? : number[],
    notifications? : string[];
}