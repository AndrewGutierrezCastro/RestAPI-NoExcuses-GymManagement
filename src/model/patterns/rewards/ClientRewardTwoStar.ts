import { DecoratorClientRewardGiving } from "./DecoratorClientRewardGiving";

export class ClientRewardTwoStar extends DecoratorClientRewardGiving{
    
    giveReward(): string {
        
        /**
         * Si son dos 
            además del premio promocional recibe gratis una
            valoración nutricional
         */

        return '1 valoracion nutricional';
    }
}