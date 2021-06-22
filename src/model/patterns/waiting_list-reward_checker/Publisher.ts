import { GymSessionUniqueDate } from "../../GymSession";
import { Subscriber } from "./Subscriber";

export abstract class Publisher{
    subscribers: Subscriber[] = [];
    abstract subscribe(subscriber : Subscriber) : void;
    abstract notifySubscribers(session : GymSessionUniqueDate) : void;
    abstract unsubscribe(subscriber : Subscriber) : void;
}