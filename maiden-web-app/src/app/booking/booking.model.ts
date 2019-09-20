import { Client } from '../clients/client.model';
import { Flight } from '../flights/flight.model';
import { BookingType } from '../booking-types/booking-type.model';

export class Booking{
    public id: number;
    public idclient: number;
    public date: string;
    public bookingType: number;
    public passengers: { 
        id: number,
        firstName: string,
        lastName: string,
        dateOfBirth: string,
        idNumber: string,
        address: string,
        contactNumber: number,
        gender: string,
        numberMiles: number,
        photo: string,
        idTypeClient: number,
        email: string,
        password: string, 
   }[];
    public selectedFlights: {id: number}[];
    
    constructor (
         id: number,
         idclient: number,
         date: string,
         bookingType: number,
         passengers: { 
            id: number,
            firstName: string,
            lastName: string,
            dateOfBirth: string,
            idNumber: string,
            address: string,
            contactNumber: number,
            gender: string,
            numberMiles: number,
            photo: string,
            idTypeClient: number,
            email: string,
            password: string, 
       }[],
         selectedFlights: {id: number}[]){
         
        
        this.id = id;
        this.idclient = idclient;
        this.date = date;
        this.bookingType = bookingType;
        this.passengers = passengers;
        this.selectedFlights = selectedFlights;
        
    }

}