import { Client } from "../../Client";
import { RewardGiving } from "./RewardGiving";

export class BaseClientReward implements RewardGiving{
    giveReward(client: Client): void {
        throw new Error("Method not implemented.");
    }
    
}