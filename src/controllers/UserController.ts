import { Authenticator } from './../auth/Authenticator';
import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Route,
} from "tsoa";
import { User } from '../model/User';

@Route("user")
export class UserController extends Controller {

    public RequestController() {}

    /**
     * Login
     * @param username 
     * @param password 
     * @returns 
     */
     @Get("login")
     public async login(
         @Query() username: string,
         @Query() password: string
     ) : Promise<any> {
        return Authenticator.login(username, password);
     }

     /**
     * Login
     * @param username 
     * @param password 
     * @returns 
     */
      @Post("signup")
      public async signup(
          @Body() userInfo : User
      ) : Promise<any> {
         return Authenticator.registerUser(userInfo);
      }

     /**
     * Refresh token
     * @param username 
     * @param password 
     * @returns 
     */
      @Get("refreshToken")
      public async refreshToken(
          @Query() userId : string,
          @Query() refreshToken : string
      ) : Promise<any> {
         return Authenticator.refreshToken(userId, refreshToken);
      }

      /**
     * Logout
     * @param username 
     * @param password 
     * @returns 
     */
       @Get("logout")
       public async logout(
            @Query() username : string, 
            @Query() jwtToken : string, 
            @Query() refreshToken : string
       ) : Promise<any> {
          return Authenticator.logout(username, jwtToken, refreshToken);
       }
}