import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../common/services/constants.service';
import { Injectable } from '@angular/core';
import { ClientType } from './client-type.model';

@Injectable({providedIn: 'root'})
export class ClientTypesService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    createAndStoreClientType(name: string, annualFee: number, monthlyMiles: number, welcomeBonus: number, bonusMiles: number){
        return this.http.post(this.constants.webServicesUrl+'/ClientTypes/ClientTypeCreate?annualFee='+ annualFee +'&bonusMiles='+ bonusMiles +'&monthlyMiles='+ monthlyMiles +'&name='+ name +'&welcomeBonus='+ welcomeBonus, null);
    }

    updateClientType(id: number, name: string, annualFee: number, monthlyMiles: number, welcomeBonus: number, bonusMiles: number){
        return this.http.post(this.constants.webServicesUrl+'/ClientTypes/ClientTypeUpdate?id='+id+'&annualFee='+ annualFee +'&bonusMiles='+ bonusMiles +'&monthlyMiles='+ monthlyMiles +'&name='+ name +'&welcomeBonus='+ welcomeBonus, null);
    }

    deleteClientType(id: number){
        return this.http.post(this.constants.webServicesUrl+'/ClientTypes/ClientTypeDelete?id='+id, null);
    }

    fetchClientTypes(){
        return this.http.get<ClientType[]>(this.constants.webServicesUrl+'/ClientTypes');
    }
}