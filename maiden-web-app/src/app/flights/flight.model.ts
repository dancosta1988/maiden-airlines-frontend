import { Airport } from '../airports/airport.model';
import { Airplane } from '../airplanes/airplane.model';

export class Flight{
    public id: number;
    public flight_number: string;
    public departure_date: string;
    public departure_airport: Airport;
    public arrival_date: string;
    public arrival_airport: Airport;
    public idairplane: Airplane;
    public gate: number;
    public status: string;
    public price: number;

    constructor ( id: number,
         flight_number: string,
         departure_date: string,
         departure_airport: Airport,
         arrival_date: string,
         arrival_airport: Airport,
         idairplane: Airplane,
         gate: number,
         status: string,
         price: number){
        
         this.id = id;
         this.flight_number = flight_number;
         this.departure_date = departure_date;
         this.departure_airport = departure_airport;
         this.arrival_date = arrival_date;
         this.arrival_airport = arrival_airport;
         this.idairplane = idairplane;
         this.gate = gate;
         this.status = status;
         this.price = price;
    }

}