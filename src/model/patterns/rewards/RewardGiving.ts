import { Client } from "../../Client";

export interface RewardGiving {
    giveReward(client : Client) : void;
}