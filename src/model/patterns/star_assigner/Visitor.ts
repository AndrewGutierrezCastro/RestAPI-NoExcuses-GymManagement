import { Client, ClientWithoutRef } from "../../Client";
import { Reservation } from "../../Reservation";

export interface Visitor {
    visite(client: Client) : Promise<void>;
}