import { GymSession } from "../../GymSession";
import { FilterStrategy } from "./FilterStrategy";

export class FilterByInstructor implements FilterStrategy{
    filter(sessions: GymSession[], filter : any): GymSession[] {
       //Filter trae instructorId
       let sessionsFilter = sessions.filter(session => {
                                return session.instructorId == filter.instructorId;
                            });

        return sessionsFilter;
    }

}