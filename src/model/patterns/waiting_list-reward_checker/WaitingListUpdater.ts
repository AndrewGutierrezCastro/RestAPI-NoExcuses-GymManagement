import { Subscriber } from "./Subscriber";

export interface WaitingListUpdater extends Subscriber {

    update(data: object): void;
    
}