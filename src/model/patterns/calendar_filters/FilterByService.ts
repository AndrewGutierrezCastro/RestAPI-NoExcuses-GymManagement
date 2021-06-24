import { GymSession } from "../../GymSession";
import { FilterStrategy } from "./FilterStrategy";

export class FilterByService implements FilterStrategy{
    filter(sessions: GymSession[], filter : any): GymSession[] {
        let sessionsFilter = sessions.filter(session => {
                                return session.serviceId == filter.serviceId;
                            });
         return sessionsFilter;
    }

}