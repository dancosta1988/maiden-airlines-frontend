import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Flight } from './flight.model';
import { Airport } from '../airports/airport.model';
import { Airplane } from '../airplanes/airplane.model';
import { ConstantsService } from '../common/services/constants.service';

@Injectable({providedIn: 'root'})
export class FlightsService {

    constructor(private http: HttpClient, private constants: ConstantsService){}

    createAndStoreFlight(
        flight_number: string,
        departure_date: string,
        departure_airport: number,
        arrival_date: string,
        arrival_airport: number,
        airplane: number,
        gate: number,
        status: string,
        price: number){
        
        return this.http.post(this.constants.webServicesUrl+'/FlightCreate?flightNumber='+flight_number+'&departureDate='+departure_date+'&departureAirport='+departure_airport+'&arrivalDate='+arrival_date+'&arrivalAirport='+arrival_airport+'&airplane='+airplane+'&gate='+gate+'&status='+status+'&price='+price,null);
    }

    updateFlight(
        id : number,
        flight_number: string,
        departure_date: string,
        departure_airport: number,
        arrival_date: string,
        arrival_airport: number,
        airplane: number,
        gate: number,
        status: string,
        price: number){
        
        return this.http.post(this.constants.webServicesUrl+'/FlightUpdate?id='+id+'&flightNumber='+flight_number+'&departureDate='+departure_date+'&departureAirport='+departure_airport+'&arrivalDate='+arrival_date+'&arrivalAirport='+arrival_airport+'&airplane='+airplane+'&gate='+gate+'&status='+price+'&status='+price,null);
    }

    deleteFlight(id: number){
        return this.http.post(this.constants.webServicesUrl+'/FlightDelete?id='+id,null);
    }

    fetchFlights(){
        return this.http.get<{id: number, flightNumber: string, departureAirport: number, departureDate: string, arrivalAirport: number, arrivalDate: string, idairplane: number, gate : number, status: string, price: number}[]>(this.constants.webServicesUrl+'/Flights');
    }
}