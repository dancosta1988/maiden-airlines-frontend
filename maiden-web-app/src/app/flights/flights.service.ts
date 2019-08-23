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
        departure_airport: Airport,
        arrival_date: string,
        arrival_airport: Airport,
        airplane: Airplane,
        gate: number,
        status: string){
        const postData: Flight = { id: null, flight_number: flight_number,
            departure_date: departure_date,
            departure_airport: departure_airport,
            arrival_date: arrival_date,
            arrival_airport: arrival_airport,
            airplane: airplane,
            gate: gate,
            status: status };
        this.http.post(this.constants.webServicesUrl+'/insertFlight', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    updateFlight(
        flight_id : number,
        flight_number: string,
        departure_date: string,
        departure_airport: Airport,
        arrival_date: string,
        arrival_airport: Airport,
        airplane: Airplane,
        gate: number,
        status: string){
        //...
    }

    deleteFlight(id: number){
        //...
    }

    fetchFlights(){
        return this.http.get<Flight[]>(this.constants.webServicesUrl+'/Flights');
    }
}