import { GymSession } from "../../GymSession";

export interface FilterStrategy {
    filter(sessions : GymSession[], filter : any) : GymSession[];
}
