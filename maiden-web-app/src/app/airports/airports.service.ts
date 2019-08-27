import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Airport } from './airport.model';
import { map } from 'rxjs/internal/operators/map';
import { ConstantsService } from '../common/services/constants.service';

@Injectable({providedIn: 'root'})
export class AirportsService {

    constructor(private http: HttpClient, private constants: ConstantsService){}

    createAndStoreAirport(name: string, short_name: string, city: string, country: string){
        console.log("inserting: " + name + " " + city + " " + country);
        //const postData: Airport = new Airport(null, name, short_name, city, country);
        return this.http.post(this.constants.webServicesUrl+'/AirportCreate?shortName='+short_name+'&country='+country+'&city='+city+'&name='+name,null)
    }

    updateAirport(id: number, name: string, short_name: string, city: string, country: string){
        //const postData: Airport = { id: id, name: name, shortName: short_name, city: city, country: country};
        return this.http.post(this.constants.webServicesUrl+'/AirportUpdate?id='+id+'&shortName='+short_name+'&country='+country+'&city='+city+'&name='+name,null);
    }

    deleteAirport(id: number){
        //const postData: Airport = { id: id, name: null, shortName: null, city: null, country: null};
        return this.http.post(this.constants.webServicesUrl +'/AirportDelete?id='+id,null);
    }

    fetchAirports(){

        return this.http.get<Airport[]>(this.constants.webServicesUrl+'/Airports');

    }
}