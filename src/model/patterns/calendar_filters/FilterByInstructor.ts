import { GymSessionUniqueDate } from "../../GymSession";
import { FilterStrategy } from "./FilterStrategy";

export class FilterByInstructor implements FilterStrategy{
    filter(sessions: GymSessionUniqueDate[]): GymSessionUniqueDate[] {
        throw new Error("Method not implemented.");
    }

}