import { Visitor } from "./Visitor";

export interface VisitedClient {
    accept(visitor : Visitor) : void;
}