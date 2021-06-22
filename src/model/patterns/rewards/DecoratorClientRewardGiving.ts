import { Client } from "../../Client";
import { RewardGiving } from "./RewardGiving";

export class DecoratorClientRewardGiving implements RewardGiving{
    constructor(
        private rewardGiving : RewardGiving
    ){}
    
    giveReward(client: Client): void {
        throw new Error("Method not implemented.");
    }

}