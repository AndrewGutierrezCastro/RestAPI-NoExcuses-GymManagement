import { Client } from "../../Client";
import { RewardGiving } from "./RewardGiving";

export class BaseClientReward implements RewardGiving{
    giveReward(): string {
        return ''; // caso donde no hay
    }
}