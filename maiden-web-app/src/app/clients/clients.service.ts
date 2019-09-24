import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../common/services/constants.service';
import { Client } from './client.model';
import { ClientType } from '../client-types/client-type.model';

@Injectable({providedIn: 'root'})
export class ClientsService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    createAndStoreClient(firstName: string,
        lastName: string,
        dateOfBirth: string,
        numberID: string,
        address: string,
        contactNumber: number,
        gender: string,
        photoPath: string,
        type: number,
        email: string,
        password: string){
        return this.http.post(this.constants.webServicesUrl+'/Clients/ClientCreate?address='+ address +'&contactNumber='+ contactNumber+'&firstName='+ firstName +'&lastName='+ lastName +'&gender='+ gender +'&dateOfBirth='+dateOfBirth +'&email='+ email +'&idNumber='+ numberID +'&idTypeClient='+ type+'&password='+ password +'&photo='+ photoPath, null);
    }

    updateClient(id: number,firstName: string,
        lastName: string,
        dateOfBirth: string,
        numberID: string,
        address: string,
        contactNumber: number,
        gender: string,
        photoPath: string,
        type: number,
        email: string,
        password: string){
        return this.http.post(this.constants.webServicesUrl+'/Clients/ClientUpdate?address='+ address +'&contactNumber='+ contactNumber+'&firstName='+ firstName +'&lastName='+ lastName +'&gender='+ gender +'&dateOfBirth='+dateOfBirth +'&email='+ email +'&idNumber='+ numberID +'&idTypeClient='+ type+'&password='+ password +'&photo='+ photoPath +'&id='+ id, null);
    }

    deleteClient(id: number){
        return this.http.post(this.constants.webServicesUrl+'/Clients/ClientDelete?id='+id, null);
    }

    getClientByMail(email: string){
        return this.http.post<{id: number,firstName: string,
            lastName: string,
            dateOfBirth: string,
            idNumber: string,
            address: string,
            contactNumber: number,
            gender: string,
            numberMiles: number,
            photo: string,
            idTypeClient: number,
            email: string
            }[]>(this.constants.webServicesUrl+'/Clients/ClientByEmail?email='+email, null);
    }

    getClientById(id: number){
        return this.http.post<{id: number,firstName: string,
            lastName: string,
            dateOfBirth: string,
            idNumber: string,
            address: string,
            contactNumber: number,
            gender: string,
            numberMiles: number,
            photo: string,
            idTypeClient: number,
            email: string
            }[]>(this.constants.webServicesUrl+'/Clients/ClientByID?id='+id, null);
    }


    fetchClients(){
        return this.http.get<{id: number,firstName: string,
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
            password: string}[]>(this.constants.webServicesUrl+'/Clients');
    }
}