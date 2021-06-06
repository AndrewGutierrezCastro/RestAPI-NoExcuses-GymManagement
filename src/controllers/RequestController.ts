import { SessionService } from './../services/SessionService';
import {
    Body,
    Controller,
    Delete,
    Post,
    Route,
    Query,
    Put
} from "tsoa";
import { ServiceService } from '../services/ServiceService';
import { GetParamsBody } from './utils';
import { Service } from '../model/Service';
import { UserService } from '../services/UserService';
import { User } from '../model/User';
import { GymSession } from '../model/GymSession';

/**
 * @description Request controller, request handler to invoke the respective service
 */
@Route("api")
export class RequestController extends Controller {

    constructor(
        private sessionService: SessionService = new SessionService(),
        private serviceService: ServiceService = new ServiceService(),
        private userService   : UserService    = new UserService()
    ) { super(); }

    // SESSIONS ---------------------------------------------------------------------------------
    @Post("sessions/get")
    public async getSessions(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return {
            givenParams: params,
            data: await this.sessionService.get(params.filter, params.projection)
        };
    }

    @Post("sessions/create")
    public async createSession(
        @Body() service: GymSession
    ): Promise<any> {
        return await this.sessionService.create(service);
    }

    // SERVICES ---------------------------------------------------------------------------------
    @Post("services/get")
    public async getServices(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return {
            givenParams: params,
            data: await this.serviceService.get(params.filter, params.projection)
        };
    }

    @Post("services/create")
    public async createService(
        @Body() service: Service
    ): Promise<any> {
        return await this.serviceService.create(service);
    }

    @Put("services/update")
    public async updateService(
        @Body() service: { serviceId : string, updatedService: Service }
    ): Promise<any> {
        return await this.serviceService.modify(service.serviceId, service.updatedService);
    }

    @Delete("services/delete")
    public async deleteService(
        @Query() serviceId: string
    ): Promise<any> {
        return await this.serviceService.delete(serviceId);
    }

    // USERS ---------------------------------------------------------------------------------
    @Post("users/get")
    public async getUsers(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return {
            givenParams: params,
            data: await this.userService.get(params.filter, params.projection)
        };
    }

    @Put("users/update")
    public async updateUser(
        @Body() service: { serviceId : string, updatedUser: User }
    ): Promise<any> {
        return await this.userService.modify(service.serviceId, service.updatedUser);
    }

    @Post("users/create")
    public async createUser(
        @Body() user: User
    ): Promise<any> {
        return await this.userService.create(user);
    }

    @Delete("users/delete")
    public async deleteSUser(
        @Query() userId: string
    ): Promise<any> {
        return await this.userService.delete(userId);
    }

}