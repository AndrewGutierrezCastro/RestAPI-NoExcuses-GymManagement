import { Subscriber } from "./Subscriber";

export interface RewardChecker extends Subscriber{
    update(data: object): void;
}