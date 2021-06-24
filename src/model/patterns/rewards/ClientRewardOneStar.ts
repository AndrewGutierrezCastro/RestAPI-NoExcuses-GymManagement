import { Client } from "../../Client";
import { DecoratorClientRewardGiving } from "./DecoratorClientRewardGiving";

export class ClientRewardOneStar extends DecoratorClientRewardGiving{
    giveReward(): string {
        
        /**
         *  Por cada estrella que mantenga recibe una 
         *  bonificación en el mes, por ejemplo, si 
         *  durante el
            mes logra mantener 1 estrellas mínimo recibe 
            algún premio promocional aleatorio como
            guantes, paños, botellas, bolsos. Si son dos 
            además del premio promocional recibe gratis una
            valoración nutricional y si son tres estrellas 
            se le incorpora una sesión de descarga muscular. 
        */

        const rewards = [
            '1 par de guantes',
            '1 paño',
            '1 botella',
            '1 bolso',
            '3 scope de proteina',
            '1 batido verde',
            '1 camisa',
        ];

        let randomRewardIndex = Math.round(Math.random() * rewards.length);
        return super.giveReward() + `\n${rewards[randomRewardIndex]}`;
    }
    

    
}