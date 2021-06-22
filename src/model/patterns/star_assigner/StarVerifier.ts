import { Client } from "../../Client";
import { Visitor } from "./Visitor";

export class StarVerifier implements Visitor{
    visite(client: Client): void {
        throw new Error("Method not implemented.");
    }
    
}