import { Authenticator } from './../auth/Authenticator';
import { Greeting } from './../model/Greeting';
import { GreetingService } from './../services/GreetingService';
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
} from "tsoa";

@Route("api")
export class RequestController extends Controller {

    private gService : GreetingService = new GreetingService();

    public RequestController() {}

    /**
     * Login
     * @param username 
     * @param password 
     * @returns 
     */
     @Get("user/login")
     public async login(
         @Query() username: string,
         @Query() password: string
     ) : Promise<any> {
        return Authenticator.login(username, password);
     }

     /**
     * Refresh token
     * @param username 
     * @param password 
     * @returns 
     */
      @Post("user/refreshToken")
      public async refreshToken(
          @Query() userId : string,
          @Query() refreshToken : string
      ) : Promise<any> {
         return Authenticator.refreshToken(userId, refreshToken);
      }

    /**
     * (example) sayHi (get example)
     * @param route 
     * @param name 
     * @returns 
     */
    @Get("hi/{route}")
    public async sayHi(
        @Path() route : string,
        @Query() name?: string
    ) : Promise<Greeting> {
        return this.gService.sayHi(route, name || '');
    }
    
    /**
     * (example) Save hi representing any other function using a service (post example)
     * @param route whatever thing but in the route <dir>/api/{route}
     * @param name your name as param <dir>/api/{route}?name={name}
     * @returns 
     */
    @Post("savehi/{route}")
    public async saveHi(
        @Path() route : string,
        @Query() name?: string
    ) : Promise<Greeting> {
        return this.gService.saveHi({route, name});
    }
}