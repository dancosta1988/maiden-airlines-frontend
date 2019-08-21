import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Airport } from './airport.model';
import { map } from 'rxjs/internal/operators/map';

@Injectable({providedIn: 'root'})
export class AirportsService {

    constructor(private http: HttpClient){}

    createAndStoreAirport(name: string, short_name: string, city: string, country: string){
        const postData: Airport = { id: null, name: name, shortName: short_name, city: city, country: country};
        this.http.post('http://192.168.56.1:8080/Airport/insertAirport', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    updateAirport(id: number, name: string, short_name: string, city: string, country: string){
        //...
    }

    deleteAirport(id: number){
        //...
    }

    fetchAirports(){
        return this.http.get<{[key: string]: Airport}>('http://192.168.56.1:8080/SOAP%20Process/ServiceAirport.serviceagent/Airport')
        .pipe(map((responseData: { [key: number]: Airport}) =>{
            const airportsArray: Airport[] = [];
            for (const key in responseData){
                if(responseData.hasOwnProperty(key)){
                airportsArray.push({ ... responseData[key]});
                }
            }
            return airportsArray;
        }));
    }
}