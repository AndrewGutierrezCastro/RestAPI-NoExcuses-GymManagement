import { ClientComplete } from "../../Client";
import { Reservation } from "../../Reservation";

export interface Visitor {
    visite(client: ClientComplete) : Promise<void>;
}