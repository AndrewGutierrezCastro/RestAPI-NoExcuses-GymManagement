import { RequestController } from "../../../controllers/RequestController";
import { ClientComplete, ClientWithoutRef } from "../../Client";
import { Visitor } from "./Visitor";
import mongoose, { model } from "mongoose";
import { Reservation } from "../../Reservation";
import { getMonthBlockIndex, getRangeDates } from "../../../utils/DateUtils";
import { GymSession } from "../../GymSession";
import { Service } from "../../Service";

export class StarVerifier implements Visitor{

    constructor(
        private reqControllerRef : RequestController,
      ) {}

    async visite(client: ClientComplete): Promise<void> {

        let blockDays = getMonthBlockIndex(new Date());
        
        let rangeDays = getRangeDates(blockDays);

        let initialDate : Date = rangeDays.initialDate;
        let finalDate : Date = rangeDays.finalDate;

        let clientId = client._id.toString();
        let reservations = <Reservation[]> await this.reqControllerRef.reservationService.get({clientId}, {});

        let reservationsOfTenDays = await this.getReservationsOfFavorites(client, reservations, initialDate, finalDate);
        
        this.giveStarToClient(client, reservationsOfTenDays, blockDays);
    }
    
    giveStarToClient(client: ClientComplete, reservationsOfTenDays: any[], blockDays : number) {
        let amountOfStars = 0;
        //no tiene reservaciones este bloque tiene 0 estrellas
        if(reservationsOfTenDays === undefined){
            amountOfStars =  0;
        }
        //Tiene 5 o mas reservaciones se le dan 3 estrellas
        if(reservationsOfTenDays.length >= 5){
            amountOfStars = 3;
        }else{
            //Si tiene 4 o 3 se le dan 2 o 1 estrella sino son 0
            amountOfStars = reservationsOfTenDays.length>2? reservationsOfTenDays.length-2 : 0;
        }
        
        client.starLevel = client.starLevel===undefined? [] : client.starLevel;
        client.starLevel[blockDays] = amountOfStars

    }

    async getReservationsOfFavorites(client : ClientComplete, reservations : Reservation[], initialDate: Date, finalDate : Date){
        let result = await Promise.all( reservations.map( async reservation => {
            let reservationDate = new Date(reservation.creationDate);
            //Si la reservacion esta en el bloque de dias revisar
            if ( reservationDate >= initialDate && reservationDate <= finalDate){
                //obtener la session de esa reservacion
                let session : any =  await this.reqControllerRef.sessionService.getOne(reservation.sessionId);
                //verificar si el servicio de esa session es de los favoritos del cliente
                let serviceFavoriteReservate = client.favoritesServices.find( (element) =>{        
                    return element == session.service._id;
                });
                //Si el servicio de esa session existe retornarlo
                return serviceFavoriteReservate != undefined? reservation : null;
            }
            return null;
        })
        );
        return result.filter(element => element !== null);
    }
    
}