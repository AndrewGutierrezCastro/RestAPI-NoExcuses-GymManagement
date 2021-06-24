import { Client } from "../../Client";
import { RewardGiving } from "./RewardGiving";


export class DecoratorClientRewardGiving implements RewardGiving{
    constructor(
        private rewardGiving : RewardGiving
    ){}
    
    giveReward(): string {
        return this.rewardGiving.giveReward();
    }
}