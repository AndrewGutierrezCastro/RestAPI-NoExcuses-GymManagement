import { Service } from './Service';
import { User } from './User';

export interface Instructor extends User {
    category : string,
    specialities : string[],
}