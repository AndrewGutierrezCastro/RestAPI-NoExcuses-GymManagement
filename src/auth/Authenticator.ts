
import express from 'express';
import jwt from "jsonwebtoken";
import API from '../API';
import { User } from '../model/User';

export class Authenticator {

    public static async login (username : string, password : string) : Promise<any> {
        
        // check missing properties
        if (!username || !password)
            return {message: 'Username or password are required', auth : false};

        // query user from mongo db
        const [user] = <User[]> await API.entityRepository.get('users', {username, password});

        // request handling
        if (user) {
            const jwtSecret : jwt.Secret = <string> process.env.JWT_SECRET
            const jwtToken = 
                jwt.sign(
                    {   
                        username: user.username,  
                        role: user.role 
                    }, 
                    jwtSecret, 
                    {  
                        expiresIn : process.env.JWT_TOKEN_EXPIRE_TIME || 300,
                        algorithm: 'HS256' 
                    }
                );

            const {password, ...userInfo} = user;

            return {
                user : userInfo,
                token : jwtToken,
                creationDate : new Date(),
                auth : true
            };
            
        } else {
            return {
                auth : false,
                message: 'Username or password incorrect',
            };
        }
    }

    public static async isAuthenticated(request: express.Request, response: express.Response, next : express.NextFunction)
    {


    }
}