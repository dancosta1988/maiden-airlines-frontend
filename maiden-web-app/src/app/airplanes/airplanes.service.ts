import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Airplane } from './airplane.model';
import { ConstantsService } from '../common/services/constants.service';

@Injectable({providedIn: 'root'})
export class AirplanesService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    createAndStoreAirplane(id: number, model: string, cargo: number, seats: number){
        //const postData: Airplane = { id: null, model: model, cargoholdCapacity: cargo, numberOfSeats: seats};
        return this.http.post(this.constants.webServicesUrl+'/Airplanes/AirplaneCreate?cargoHoldCapacity='+cargo+'&model='+model+'&numberSeats='+seats+'&id='+id, null);
    }

    updateAirplane(id: number, model: string, cargo: number, seats: number){
        //const postData: Airplane = { id: id, model: model, cargoholdCapacity: cargo, numberOfSeats: seats};
        return this.http.post(this.constants.webServicesUrl+'/Airplanes/AirplaneUpdate?cargoHoldCapacity='+cargo+'&model='+model+'&numberSeats='+seats+'&id='+id, null);
    }

    deleteAirplane(id: number){
        //const postData: Airplane = { id: null, model: null, cargoholdCapacity: null, numberOfSeats: null};
        return this.http.post(this.constants.webServicesUrl+'/Airplanes/AirplaneDelete?id='+id, null);
    }

    fetchAirplanes(){
        return this.http.get<Airplane[]>(this.constants.webServicesUrl+'/Airplanes');
    }
}