import { GymSessionUniqueDate } from "../../GymSession";

export interface FilterStrategy {
    filter(sessions : GymSessionUniqueDate[]) : GymSessionUniqueDate[];
}