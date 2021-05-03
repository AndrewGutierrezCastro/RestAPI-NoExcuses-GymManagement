import { UserSchema } from '../db/schemas/UserSchema';

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
        if (request.path == "/api/user/login") {
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