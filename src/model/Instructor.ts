import { Service } from './Service';
import { User } from './User';

export interface Instructor extends User {
    category : string,
    specialities : string[],
}

export interface InstructorWithoutRef {
    userId : string
    category? : string,
    specialities : string[],
}