import { GymSessionUniqueDate } from "../../GymSession";
import { FilterStrategy } from "./FilterStrategy";

export class FilterByService implements FilterStrategy{
    filter(sessions: GymSessionUniqueDate[]): GymSessionUniqueDate[] {
        throw new Error("Method not implemented.");
    }

}