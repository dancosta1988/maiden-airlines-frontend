import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Airplane } from './airplane.model';
import { map } from 'rxjs/internal/operators/map';

@Injectable({providedIn: 'root'})
export class AirplanesService {

    constructor(private http: HttpClient){}

    createAndStoreAirplane(id: number, model: string, cargo: number, seats: number){
        const postData: Airplane = { id: null, model: model, cargoholdCapacity: cargo, numberOfSeats: seats};
        this.http.post('http://192.168.0.189:8080/Airport/insertAirplane', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    updateAirplane(id: number, model: string, cargo: number, seats: number){
        //...
    }

    deleteAirplane(id: number){
        //...
    }

    fetchAirplanes(){
        return this.http.get<{[key: string]: Airplane}>('http://192.168.0.189:8080/SOAP%20Process/ServiceAirport.serviceagent/Airplane',{
            headers: new HttpHeaders({'Access-Control-Allow-Origin': "http://localhost:4200"})
        })
        .pipe(map((responseData: { [key: number]: Airplane}) =>{
            const airportsArray: Airplane[] = [];
            for (const key in responseData){
                if(responseData.hasOwnProperty(key)){
                airportsArray.push({ ... responseData[key]});
                }
            }
            return airportsArray;
        }));
    }
}