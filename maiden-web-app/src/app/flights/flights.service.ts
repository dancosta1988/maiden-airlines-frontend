import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Flight } from './flight.model';
import { map } from 'rxjs/internal/operators/map';
import { Airport } from '../airports/airport.model';
import { Airplane } from '../airplanes/airplane.model';

@Injectable({providedIn: 'root'})
export class FlightsService {

    constructor(private http: HttpClient){}

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
        this.http.post('http://192.168.56.1:8080/Airport/insertFlight', 
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
        return this.http.get<{[key: string]: Flight}>('http://192.168.56.1:8080/SOAP%20Process/ServiceAirport.serviceagent/Flight',{
            headers: new HttpHeaders({'Access-Control-Allow-Origin': "http://localhost:4200"})
        })
        .pipe(map((responseData: { [key: number]: Flight}) =>{
            const flightsArray: Flight[] = [];
            for (const key in responseData){
                if(responseData.hasOwnProperty(key)){
                flightsArray.push({ ... responseData[key]});
                }
            }
            return flightsArray;
        }));
    }
}