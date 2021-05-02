import { EntityRepository } from '../repository/EntityRepository';
import { Greeting } from './../model/Greeting';

// A post request should not contain an id.
export type GreetingCreationParams = Pick<Greeting, "route" | "name">;

export class GreetingService {

  saveHi(greetingCreationParams: GreetingCreationParams): Greeting {

    const newHi : Greeting = {
      message : `Hi ${greetingCreationParams.name} - saving here xd!`,
      ...greetingCreationParams,
    };

    return newHi;
  }

  public sayHi(route : string, name : string): Greeting {
    return {
        message : `Hi ${name}`,
        route,
        name
    };
  }
}