import { Client } from "../../Client";
import { DecoratorClientRewardGiving } from "./DecoratorClientRewardGiving";

export class ClientRewardThreeStar extends DecoratorClientRewardGiving{
    giveReward(): string {

        /**
         * si son tres estrellas 
            se le incorpora una sesión de descarga muscular
         */

        return super.giveReward() + '\n1 sesion de descarga muscular';
    }
    
}