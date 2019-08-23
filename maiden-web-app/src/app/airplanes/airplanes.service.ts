import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Airplane } from './airplane.model';
import { ConstantsService } from '../common/services/constants.service';

@Injectable({providedIn: 'root'})
export class AirplanesService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    createAndStoreAirplane(id: number, model: string, cargo: number, seats: number){
        const postData: Airplane = { id: null, model: model, cargoholdCapacity: cargo, numberOfSeats: seats};
        this.http.post(this.constants.webServicesUrl+'/insertAirplane', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    updateAirplane(id: number, model: string, cargo: number, seats: number){
        const postData: Airplane = { id: id, model: model, cargoholdCapacity: cargo, numberOfSeats: seats};
        this.http.post(this.constants.webServicesUrl+'/insertAirplane', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    deleteAirplane(id: number){
        const postData: Airplane = { id: null, model: null, cargoholdCapacity: null, numberOfSeats: null};
        this.http.post(this.constants.webServicesUrl+'/insertAirplane', 
        postData
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    fetchAirplanes(){
        return this.http.get<Airplane[]>(this.constants.webServicesUrl+'/Airplanes');
    }
}