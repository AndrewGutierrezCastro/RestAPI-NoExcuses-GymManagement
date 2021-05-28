import { SessionGetParams, SessionService } from './../services/SessionService';
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
    
    constructor( private sessionService : SessionService = new SessionService() ) {
        super();
    }

    @Post("sessions")
    public async getSessions(
        @Body() params : SessionGetParams
    ) :Promise<any> {
        return this.sessionService.get(params.filter || {}, params.projection || {});
    }
}