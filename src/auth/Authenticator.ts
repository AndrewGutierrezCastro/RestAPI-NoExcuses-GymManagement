import express from 'express';
import jwt from "jsonwebtoken";
import randtoken from "rand-token";
import bcrypt from "bcrypt";

import API from '../API';
import { User } from '../model/User';

const allowableApiCallsWithoutAuth = [
    "/user/login",
    "/user/refreshToken"
];

let refreshTokens : Map<string, string> = new Map(); // to avoid mongodb calls

export class Authenticator {

    private static developmentMode : boolean = true;

    public static async login (username : string, password : string) : Promise<any> {
        
        // check missing properties
        if (!username || !password)
            return {message: 'Username and password are required', auth : false};

        // query user from mongo db
        const [user] = <User[]> await API.entityRepository.get('users',{username}, {username:1, password:1, role:1, _id:1});

        // request handling
        if (user) {
            // check password with hashed password
            if (bcrypt.compareSync(password, user.password))
            {
                const jwtToken = 
                    jwt.sign(
                        {  id : user._id }, 
                        <string> process.env.JWT_SECRET, 
                        {  
                            expiresIn : process.env.JWT_TOKEN_EXPIRE_TIME
                        }
                    );

                // generate refresh token
                const {password, ...userInfo} = user;
                const refreshToken = randtoken.uid(256);
                refreshTokens.set(refreshToken, userInfo._id || '');

                return {
                    user : userInfo,
                    token : jwtToken,
                    refreshToken,
                    expireTimeInSeconds : process.env.TOKEN_EXPIRE_TIME, // seconds to refresh to frontend use to refresh session
                    auth : true
                };
            }   
        } 
    
        return {
            auth : false,
            message: 'Username or password incorrect',
        };
    }

    public static async logout (username : string, jwtToken : string, refreshToken : string) : Promise<any> {
        
        // check missing properties
        if (!username || !jwtToken)
            return {message: 'Username, jwt token and refresh token are required', auth : false};

        // query user from mongo db
        const [user] = <User[]> await API.entityRepository.get('users',{username}, {_id : 1});

        // logout handling
        if (user) {
            return jwt.verify(<string>jwtToken, <string>process.env.JWT_SECRET, (err, payload: any) => {
                if (err)
                    return { logout: false, message: "Authentication failed" };
                else {
                    refreshTokens.delete(refreshToken);
                    return { logout: true, message: "You logout correctly!" };
                }
            })
        } else {
            return {
                logout : false,
                message: 'User doesn\'t exists',
            };
        }
    }

    public static async refreshToken(userId : string, refreshToken : string) 
    {
        // check if the refresh token exists
        if ( !refreshTokens.has(refreshToken) )
            return {
                auth : false,
                message: 'Invalid refresh token, you need to login first',
            };

        // if exists generate a new jwt token to maintain session correctly
        const newJwtToken = 
            jwt.sign(
                {  id : userId }, 
                <string> process.env.JWT_SECRET, 
                {  
                    expiresIn : process.env.JWT_TOKEN_EXPIRE_TIME
                }
            );

        return {
            token : newJwtToken,
            expireTimeInSeconds : process.env.TOKEN_EXPIRE_TIME
        };        
    }

    public static async registerUser(user : User) {

        // check if the email or the username is already used for any other user
        const usersEmails = <User[]> await API.entityRepository.get('users', { $or:[ {email : user.email}, {username : user.email} ] }, {_id:1});

        if (usersEmails.length > 0)
            return {
                signup : false,
                message : 'The email or username is already used'
            }
        
        // password encryption process
        const saltRounds = 10;

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(user.password, salt);
        
        // register process
        const result:any = await API.entityRepository.create('users', {...user, password : hashedPassword});

        return {
            newUser: result.createdObject,
            signup : true,
            message : `Sign up correctly for ${user.firstName} ${user.lastName}, now you can login`
        };
    }

    public static async isAuthenticated(
        request: express.Request, 
        response: express.Response, 
        next : express.NextFunction
    ) {

        // DEVELOPMENT MODE: to avoid use token when the API is not in production
        if (Authenticator.developmentMode)
        {
            next();
            return;
        }

        // check if the request path can be reached without authentication
        if (allowableApiCallsWithoutAuth.includes(request.path)) {
            next();
            return;
        }

        // extract jwt token from header
        const token = request.headers["x-access-token"];

        // token handling
        if (!token || typeof token !== 'string' )
        {
            response.send('You need a token, please add the token using "x-access-token" header');
        }
        else 
        {
            // check if is a valid jwt token
            jwt.verify(<string> token, <string> process.env.JWT_SECRET, (err, payload : any) => {
                if (err)
                    response.json({auth : false, message: "Authentication failed"});
                else 
                {
                    request.headers.id = payload.id;
                    // response.json({auth : true, message: "Authentication successed!"});
                    next();
                }
            })
        }
    }
}