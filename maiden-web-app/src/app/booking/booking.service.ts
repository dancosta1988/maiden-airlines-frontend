import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../common/services/constants.service';
import { Booking } from './booking.model';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class BookingsService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    createAndStoreBooking(booking: Booking){
        
        return this.http.post(this.constants.webServicesUrl+'/Bookings/BookingCreate',{'bookings': booking},{headers : {'Content-Type': 'application/json'}});
    }

    updateBooking(id: number, name: string){
        return this.http.post(this.constants.webServicesUrl+'/Bookings/BookingUpdate?id='+id+'&name='+name, null);
    }

    updateBookingFlightClient(id: number, flightId: number, clientId: number){
        return this.http.post(this.constants.webServicesUrl+'/Bookings/UpdateBookingClientFlight?id='+id+'&flightID='+flightId+'&clientId='+clientId, null);
    }

    checkin(id: number, seat: string, idClient: number, idFlight: number){
        return this.http.post(this.constants.webServicesUrl+'/Bookings/CheckIn?id='+id+'&seat='+seat+'&checkIn=1&idClient='+idClient+'&idFlight='+idFlight, null,{responseType: 'text'});
    }

    deleteBooking(id: number){
        return this.http.post(this.constants.webServicesUrl+'/Bookings/BookingDelete?id='+id, null);
    }

    fetchBookings(){
        return this.http.get<Booking[]>(this.constants.webServicesUrl+'/Bookings');
    }

    getBookingById(id: number){
        return this.http.post<Booking[]>(this.constants.webServicesUrl+'/Bookings/BookingByID?id='+id, null);
    }

    getBookingFlightClientByBookingId(id: number){
        return this.http.post<{id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[]>(this.constants.webServicesUrl+'/Bookings/BookingByClientFlight?idBooking='+id+'&idFlight=&idClient=&id=', null);
    }

    getBookingFlightClientByFlightId(id: number){
        return this.http.post<{id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[]>(this.constants.webServicesUrl+'/Bookings/BookingByClientFlight?idBooking=&idFlight='+id+'&idClient=&id=', null);
    }
}