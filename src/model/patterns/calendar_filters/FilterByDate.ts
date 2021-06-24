import { GymSession } from "../../GymSession";
import { FilterStrategy } from "./FilterStrategy";

export class FilterByDate implements FilterStrategy{
    filter(sessions: GymSession[], filter : any): GymSession[] {
        let sessionsFilter = sessions.filter(session => {
            let sessionDate = new Date(session.dayHour[0].dayOfTheWeek);
            let sessionMonth = sessionDate.getDate();
            return sessionDate.toString() == filter.Date;
        });
        return sessionsFilter;
    }
}