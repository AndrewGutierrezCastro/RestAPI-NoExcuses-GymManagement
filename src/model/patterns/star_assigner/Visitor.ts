import { Client } from "../../Client";

export interface Visitor {
    visite(client : Client) : void;
}