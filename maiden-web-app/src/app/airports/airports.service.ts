import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Airport } from './airport.model';
import { ConstantsService } from '../common/services/constants.service';

@Injectable({providedIn: 'root'})
export class AirportsService {

    constructor(private http: HttpClient, private constants: ConstantsService){}

    createAndStoreAirport(name: string, short_name: string, city: string, country: string, imagePath: string){
        return this.http.post(this.constants.webServicesUrl+'/Airports/AirportCreate?shortName='+short_name+'&country='+country+'&city='+city+'&name='+name+'&imagePath='+imagePath,null)
    }

    updateAirport(id: number, name: string, short_name: string, city: string, country: string, imagePath: string){
        return this.http.post(this.constants.webServicesUrl+'/Airports/AirportUpdate?id='+id+'&shortName='+short_name+'&country='+country+'&city='+city+'&name='+name+'&imagePath='+imagePath,null);
    }

    deleteAirport(id: number){
        return this.http.post(this.constants.webServicesUrl +'/Airports/AirportDelete?id='+id,null);
    }

    fetchAirports(){
        return this.http.get<Airport[]>(this.constants.webServicesUrl+'/Airports');
    }
}