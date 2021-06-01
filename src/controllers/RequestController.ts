import { SessionService } from './../services/SessionService';
import {
    Body,
    Controller,
    Delete,
    Post,
    Route,
    Query
} from "tsoa";
import { ServiceService } from '../services/ServiceService';
import { GetParamsBody } from './utils';
import { Service } from '../model/Service';

/**
 * @description Request controller
 * 
 */
@Route("api")
export class RequestController extends Controller {

    constructor( 
        private sessionService : SessionService = new SessionService(),
        private serviceService : ServiceService = new ServiceService(),
        ) { super(); }

    // SESSIONS ---------------------------------------------------------------------------------

    /**
     * Get objects from the collection using the given params
     * @param params filter & projection
     * @returns JSON with the used params to retrieve the data from db and result set
     */
    @Post("sessions/get")
    public async getSessions(
        @Body() params : GetParamsBody
    ) :Promise<any> {
        return {
            givenParams : params,
            data: await this.sessionService.get(params.filter, params.projection)
        };
    }

    //  /**
    //  * Create a new session
    //  * @param session new object to add to the collection
    //  * @returns a
    //  */
    //   @Post("sessions/create")
    //   public async createSession(
    //       @Body() session : Session
    //   ) :Promise<any> {
    //       return await this.sessionService.create(session);
    //   }

    // SERVICES ---------------------------------------------------------------------------------

    /**
     * Get objects from the collection using the given params
     * @param params filter & projection
     * @returns JSON with the used params to retrieve the data from db and result set
     */
    @Post("services/get")
    public async getServices(
        @Body() params : GetParamsBody
    ) :Promise<any> {
        return {
            givenParams : params,
            data: await this.serviceService.get(params.filter, params.projection)
        };
    }

    /**
     * Create a new service
     * @param service new object to add to the collection
     * @returns a
     */
    @Post("services/create")
    public async createService(
        @Body() service : Service
    ) :Promise<any> {
        return await this.serviceService.create(service);
    }

    /**
     * Update an existing service
     * @param service with the oldService and newService objects
     * @returns update response with details from db
     */
    @Post("services/update")
    public async updateService(
        @Body() service : { oldService: Service, newService : Service }
    ) :Promise<any> {
        return await this.serviceService.modify(service.oldService, service.newService);
    }

    /**
     * Delete a service using the object id
     * @param serviceId the object id of the service to find and delete
     * @returns deleted response with details from db
     */
    @Delete("services/delete")
    public async deleteService(
        @Query() serviceId : string
    ) :Promise<any> {
        return await this.serviceService.delete(serviceId);
    }
}