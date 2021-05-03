import { UserSchema } from '../db/schemas/UserSchema';

import express from 'express';
import jwt from "jsonwebtoken";
import randtoken from "rand-token";

import API from '../API';
import { User } from '../model/User';

const allowableApiCallsWithoutAuth = [
    "/api/user/login",
    "/api/user/refreshToken"
];

let refreshTokens : Map<string, string> = new Map(); // to avoid mongodb calls

export class Authenticator {

    public static async login (username : string, password : string) : Promise<any> {
        
        // check missing properties
        if (!username || !password)
            return {message: 'Username or password are required', auth : false};

        // query user from mongo db
        const [user] = <User[]> await API.entityRepository.get('users',{username, password}, {username:1, password:1, role:1, _id:1});

        // request handling
        if (user) {
            const jwtToken = 
                jwt.sign(
                    {  id : user._id }, 
                    <string> process.env.JWT_SECRET, 
                    {  
                        expiresIn : process.env.JWT_TOKEN_EXPIRE_TIME
                    }
                );

            const {password, ...userInfo} = user;
            const refreshToken = randtoken.uid(256);
        
            refreshTokens.set(refreshToken, userInfo._id);
            console.log(refreshTokens);

            return {
                user : userInfo,
                token : jwtToken,
                refreshToken,
                expireTimeInSeconds : process.env.TOKEN_EXPIRE_TIME, // seconds to refresh to frontend use to refresh session
                auth : true
            };
            
        } else {
            return {
                auth : false,
                message: 'Username or password incorrect',
            };
        }
    }

    public static async refreshToken(userId : string, refreshToken : string) 
    {
        console.log('-----------------------------');
        console.log(userId);
        console.log(refreshTokens);
        console.log(refreshTokens.get(refreshToken) === userId)

        refreshTokens.has

        if ( !refreshTokens.has(refreshToken) )
            return {
                auth : false,
                message: 'Invalid refresh token, you need to login first',
            };

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

    public static async isAuthenticated(request: express.Request, response: express.Response, next : express.NextFunction)
    {
        if (!(request.path in allowableApiCallsWithoutAuth)) {
            next();
            return;
        }

        const token = `${request.headers["x-access-token"]}`;

        if (!token || typeof token !== 'string' )
        {
            response.send('You need a token, please add the token in the access token header');
        }
        else 
        {
            jwt.verify(<string> token, <string> process.env.JWT_SECRET, (err, decoded : any) => {

                if (err)
                    response.json({auth : false, message: "Authentication failed"});
                else 
                {
                    request.headers.id = decoded.id;
                    response.json({auth : true, message: "Authentication successed!"});
                    next();
                }
            })
        }
    }
}