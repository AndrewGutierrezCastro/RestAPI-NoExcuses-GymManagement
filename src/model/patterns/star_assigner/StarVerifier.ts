import { RequestController } from "../../../controllers/RequestController";
import { Client, ClientWithoutRef } from "../../Client";
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

    async visite(client: Client): Promise<Client> {

        let blockDays = getMonthBlockIndex(new Date());
        
        let rangeDays = getRangeDates(blockDays);

        let initialDate : Date = rangeDays.initialDate;
        let finalDate : Date = rangeDays.finalDate;

        let clientId = new mongoose.mongo.ObjectID("60d1702eaa75291be498a1b0");
        let reservations = <Reservation[]> await this.reqControllerRef.reservationService.get({clientId}, {});
        console.log(clientId);
        console.log(reservations);
        //let reservationsOfTenDays = await this.getReservationsOfFavorites(client, reservations, initialDate, finalDate);

        //let clientModify = this.giveStarToClient(client, reservationsOfTenDays, blockDays);

        return client;
    }
    
    giveStarToClient(client: Client, reservationsOfTenDays: (Reservation | undefined)[], blockDays : number) {
        let amountOfStars = 0;
        //no tiene reservaciones este bloque tiene 0 estrellas
        if(reservationsOfTenDays === undefined){
            amountOfStars =  0;
        }
        //Tiene 5 o mas reservaciones se le dan 3 estrellas
        if(reservationsOfTenDays.length >= 5){
            amountOfStars = 3;
        }
        //Si tiene 4 o 3 se le dan 2 o 1 estrella sino son 0
        amountOfStars = reservationsOfTenDays.length>2? reservationsOfTenDays.length-2 : 0;
        
        client.starLevel = client.starLevel===undefined? [] : client.starLevel;
        client.starLevel[blockDays] = amountOfStars
        return client;

    }

    async getReservationsOfFavorites(client : Client, reservations : Reservation[], initialDate: Date, finalDate : Date){
        let result = await Promise.all(reservations.map(async reservation => {
            let reservationDate = new Date(reservation.creationDate);
                //Si la reservacion esta en el bloque de dias revisar
                console.log(initialDate, finalDate, reservationDate,  reservationDate >= initialDate && reservationDate <= finalDate);
                if ( reservationDate >= initialDate && reservationDate <= finalDate){
                    //obtener la session de esa reservacion
                    let session = <GymSession> await this.reqControllerRef.sessionService.getOne(reservation.sessionId);
                    //verificar si el servicio de esa session es de los favoritos del cliente
                    let serviceFavoriteReservate = client.favoritesServices.find( (element) =>{
                        console.log(element, session.serviceId, element==session.serviceId);
                        return element == session.serviceId;
                    });
                    //Si el servicio de esa session existe retornarlo
                    if(serviceFavoriteReservate !== undefined){
                        return reservation
                    }
                }
            }
            )
        );
        return result;
    }
    
}