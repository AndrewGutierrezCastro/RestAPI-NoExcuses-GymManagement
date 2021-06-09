import { Instructor, InstructorWithoutRef } from './../model/Instructor';
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
import { RoomService } from '../services/RoomService';
import { Room } from '../model/Room';
import { InstructorService } from '../services/InstructorService';
import { CalendarService } from '../services/CalendarService';
import { Calendar } from '../model/Calendar';
import { ReservationService } from '../services/ReservationService';
import { Reservation } from '../model/Reservation';
import { MembershipService } from '../services/MembershipService';
import { Membership } from '../model/Membership';
import { Payment } from '../model/Payment';
import { PaymentService } from '../services/PaymenService';
import { Client } from '../model/Client';
import { ClientService } from './../services/ClientService';
import { ProfileService } from './../services/ProfileService';

/**
 * @description Request controller
 * The request handler to invoke the respective service
 */
@Route("api")
export class RequestController extends Controller {

    constructor(
        private sessionService: SessionService = new SessionService(),
        private serviceService: ServiceService = new ServiceService(),
        private userService   : UserService    = new UserService(),
        private roomService   : RoomService    = new RoomService(),
        private calendarService : CalendarService = new CalendarService(),
        private reservationService : ReservationService = new ReservationService(),
        private membershipService : MembershipService = new MembershipService(),
        private paymentService : PaymentService = new PaymentService(),
        private instructorService : InstructorService = new InstructorService(),
        private clientService : ClientService = new ClientService(),
        private profileService : ProfileService = new ProfileService()

    ) { super(); }

    // SESSIONS ---------------------------------------------------------------------------------
    @Post("sessions/get")
    public async getSessions(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return await this.sessionService.get(params.filter, params.projection);
    }

    @Post("sessions/create")
    public async createSession(
        @Body() service: GymSession
    ): Promise<any> {
        return await this.sessionService.create(service);
    }

    @Delete("sessions/delete")
    public async deleteSession(
        @Query() sessionId : string
    ): Promise<any> {
        return await this.sessionService.delete(sessionId);
    }

    @Put("sessions/update")
    public async updateSession(
        @Body() session: { sessionId : string, updatedSession: GymSession }
    ): Promise<any> {
        return await this.serviceService.modify(session.sessionId, session.updatedSession);
    }

    // SERVICES ---------------------------------------------------------------------------------
    @Post("services/get")
    public async getServices(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return await this.serviceService.get(params.filter, params.projection);
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
        return await this.userService.get(params.filter, params.projection);
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

    // ROOMS ---------------------------------------------------------------------------------------
    @Post("rooms/get")
    public async getRooms(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return await this.roomService.get(params.filter, params.projection);
    }

    @Put("rooms/update")
    public async updateRoom(
        @Body() room: { roomId : string, updatedRoom: Room }
    ): Promise<any> {
        return await this.roomService.modify(room.roomId, room.updatedRoom);
    }

    @Post("rooms/create")
    public async createRoom(
        @Body() room: Room
    ): Promise<any> {
        return await this.roomService.create(room);
    }

    @Delete("rooms/delete")
    public async deleteRoom(
        @Query() roomId: string
    ): Promise<any> {
        return await this.roomService.delete(roomId);
    }

     // INSTRUCTOR ---------------------------------------------------------------------------------------

     @Post("instructor/get")
     public async getInstructor(
        @Body() params: GetParamsBody
     ): Promise<any> {
        return await this.instructorService.get(params.filter, params.projection);
     }
 
     @Put("instructor/update")
     public async updateInstructor(
        @Body() instructor: { instructorId : string, updatedInstructor: Room }
     ): Promise<any> {
        return await this.instructorService.modify(instructor.instructorId, instructor.updatedInstructor);
     }
 
     @Post("instructor/create")
     public async createInstructor(
        @Body() instructor: InstructorWithoutRef
     ): Promise<any> {
        return await this.instructorService.create(instructor);
     }
 
     @Delete("instructor/delete")
     public async deleteInstructor(
        @Query() instructorId: string
     ): Promise<any> {
        return await this.instructorService.delete(instructorId);
     }
    //Calendar -------------------------------------------------------
    @Post("calendar/get")
    public async getCalendar(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return await this.calendarService.get(params.filter, params.projection);
    }

    @Put("calendar/update")
    public async updateCalendar(
        @Body() calendar: { calendarId : string, updatedCalendar: Calendar }
    ): Promise<any> {
        return await this.calendarService.modify(calendar.calendarId, calendar.updatedCalendar);
    }

    @Post("calendar/create")
    public async createCalendar(
        @Body() calendar: Calendar
    ): Promise<any> {
        return await this.calendarService.create(calendar);
    }

    @Delete("calendar/delete")
    public async deleteCalendar(
        @Query() calendarId: string
    ): Promise<any> {
        return await this.calendarService.delete(calendarId);
    }
    //Reservations -------------------------------------------------------
    @Post("reservation/get")
    public async getReservation(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return await this.reservationService.get(params.filter, params.projection);
    }

    @Put("reservation/update")
    public async updateReservation(
        @Body() reservation: { reservationId : string, updatedReservation: Reservation }
    ): Promise<any> {
        return await this.reservationService.modify(reservation.reservationId, reservation.updatedReservation);
    }

    @Post("reservation/create")
    public async createReservation(
        @Body() reservation: Reservation
    ): Promise<any> {
        return await this.reservationService.create(reservation);
    }

    @Delete("reservation/delete")
    public async deleteReservation(
        @Query() reservationId: string
    ): Promise<any> {
        return await this.reservationService.delete(reservationId);
    }
    //Memberships-------------------------------------------------------
    @Post("membership/get")
    public async getMembership(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return await this.membershipService.get(params.filter, params.projection);
    }

    @Put("membership/update")
    public async updateMembership(
        @Body() membership: { membershipId : string, updatedMembership: Membership }
    ): Promise<any> {
        return await this.membershipService.modify(membership.membershipId, membership.updatedMembership);
    }

    @Post("membership/create")
    public async createMembership(
        @Body() membership: Membership
    ): Promise<any> {
        return await this.membershipService.create(membership);
    }

    @Delete("membership/delete")
    public async deleteMembership(
        @Query() membershipId: string
    ): Promise<any> {
        return await this.membershipService.delete(membershipId);
    }
    //Payment-------------------------------------------------------
    @Post("payment/get")
    public async getPayment(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return await this.paymentService.get(params.filter, params.projection);
    }

    @Put("payment/update")
    public async updatePayment(
        @Body() payment: { paymentId : string, updatedPayment: Payment }
    ): Promise<any> {
        return await this.paymentService.modify(payment.paymentId, payment.updatedPayment);
    }

    @Post("payment/create")
    public async createPayment(
        @Body() payment: Payment
    ): Promise<any> {
        return await this.paymentService.create(payment);
    }

    @Delete("payment/delete")
    public async deletePayment(
        @Query() paymentId: string
    ): Promise<any> {
        return await this.paymentService.delete(paymentId);
    }

    //client-----------------------------------------------------------------------------
    @Post("client/get")
    public async getClient(
        @Body() params: GetParamsBody
    ): Promise<any> {
        return await this.clientService.get(params.filter, params.projection);
    }

    @Put("client/update")
    public async updateClient(
        @Body() client: { clientId : string, updatedClient: Client }
    ): Promise<any> {
        return await this.clientService.modify(client.clientId, client.updated);
    }

    @Post("client/create")
    public async createClient(
        @Body() client: Client
    ): Promise<any> {
        return await this.clientService.create(client);
    }

    @Delete("client/delete")
    public async deleteClient(
        @Query() clientId: string
    ): Promise<any> {
        return await this.clientService.delete(clientId);
    }
}