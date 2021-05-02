import { MongoDbConnection } from './db/MongoDbConnection';
import express, { Response as ExResponse, Request as ExRequest } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";

dotenv.config();

const app = express();

export default class API {

    static init() 
    {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors());
        app.use(bodyParser.json());
        app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => res.send(swaggerUi.generateHTML(await import("../build/swagger.json"))));
        app.set("port", process.env.PORT || 7000);
        
        RegisterRoutes(app); // tsoa router linking...

        new MongoDbConnection(); // connect to mongo db
    }

    static run() {
        app.listen(app.get("port"), () =>
            console.log(`Example app listening at http://localhost:${app.get("port")}`)
        );
    }

}