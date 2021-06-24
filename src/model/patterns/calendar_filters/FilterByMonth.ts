import { GymSession } from "../../GymSession";
import { FilterStrategy } from "./FilterStrategy";

export class FilterByMonth implements FilterStrategy{
    filter(sessions: GymSession[], filter : any): GymSession[] {
        let sessionsFilter = sessions.filter(session => {
            let sessionDate = new Date(session.dayHour[0].dayOfTheWeek);
            let sessionMonth = sessionDate.getMonth();
            return sessionMonth.toString() == filter.month;
        });
        return sessionsFilter;
    }
}