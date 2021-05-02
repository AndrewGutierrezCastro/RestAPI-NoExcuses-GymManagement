
import express from 'express';
import jwt from "jsonwebtoken";
import { MongoDbConnection } from '../db/MongoDbConnection';
import { User } from '../model/User';
import { EntityRepository } from './../repository/EntityRepository';

export class Authenticator {

    private entityRepository : EntityRepository = new EntityRepository();
    
    public async login (request: express.Request, response: express.Response, next : express.NextFunction) : Promise<void> {
        const { username, password } = request.body;

        const [user] = <User[]> await this.entityRepository.get('users', {username, password});

        if (user) {
            const jwtSecret : jwt.Secret = <string> process.env.JWT_SECRET
            const accessToken = jwt.sign({ username: user.username,  role: user.role }, jwtSecret);

            response.json({
                accessToken
            });
        } else {
            response.send('Username or password incorrect');
        }
    }

}