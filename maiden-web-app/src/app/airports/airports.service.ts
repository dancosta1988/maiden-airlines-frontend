import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Airport } from './airport.model';
import { map } from 'rxjs/internal/operators/map';
import { ConstantsService } from '../common/services/constants.service';

@Injectable({providedIn: 'root'})
export class AirportsService {

    constructor(private http: HttpClient, private constants: ConstantsService){}

    createAndStoreAirport(name: string, short_name: string, city: string, country: string){
        const postData: Airport = { id: null, name: name, shortName: short_name, city: city, country: country};
        this.http.post(this.constants.webServicesUrl+'/insertAirport', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    updateAirport(id: number, name: string, short_name: string, city: string, country: string){
        const postData: Airport = { id: id, name: name, shortName: short_name, city: city, country: country};
        this.http.post(this.constants.webServicesUrl+'/updateAirport', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    deleteAirport(id: number){
        const postData: Airport = { id: id, name: null, shortName: null, city: null, country: null};
        this.http.post(this.constants.webServicesUrl +'/deleteAirport', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    fetchAirports(){

        return this.http.get<Airport[]>(this.constants.webServicesUrl+'/Airports');

    }
}