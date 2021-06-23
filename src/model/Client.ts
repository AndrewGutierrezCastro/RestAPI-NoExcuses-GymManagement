import { VisitedClient } from "./patterns/star_assigner/VisitedClient";
import { Visitor } from "./patterns/star_assigner/Visitor";
import { Service } from "./Service";
import { User } from "./User";

export class Client implements User, VisitedClient {
    constructor(
        pClient : {
        username: string ,
        password: string ,
        role: string,
        firstName: string ,
        lastName: string,
        identification: string,
        email: string,
        phoneNumber: string,
        pendingPayment: string[],
        balance: number,
        memberships: string[],
        favoritesServices : string[],
        starLevel : number[],
        notifications : string[],
        userId : string,
        _id: string
    }
    ){
        this.username = pClient.username;
        this.password = pClient.password;
        this.role = pClient.role;
        this.firstName = pClient.firstName;
        this.lastName = pClient.lastName;
        this.identification = pClient.identification;
        this.email = pClient.email;
        this.phoneNumber = pClient.phoneNumber;
        this.pendingPayment = pClient.pendingPayment;
        this.balance = pClient.balance;
        this.memberships = pClient.memberships;
        this.favoritesServices = pClient.favoritesServices;
        this.starLevel = pClient.starLevel;
        this.notifications = pClient.notifications;
        this._id = pClient._id;
        this.userId = pClient.userId;

    }
    public username: string = "";
    public password: string = "";
    public role: string = "";
    public firstName: string = "";
    public lastName: string = "";
    public identification: string = "";
    public email: string = "";
    public phoneNumber: string = "";
    public _id: string  = "";
    public pendingPayment: string[] = [];
    public balance: number = 0;
    public memberships: string[] = [];
    public favoritesServices : string[] = [];
    public starLevel : number[] = [];
    public notifications : string[] = [];
    public userId : string = "";

    async accept(visitor : Visitor) : Promise<Client>{
        return await visitor.visite(this);
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