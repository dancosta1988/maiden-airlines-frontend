import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../common/services/constants.service';
import { Operator } from './backoffice-operator.model';


@Injectable({providedIn: 'root'})
export class OperatorsService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    getOperatorByUsername(username: string){
        return this.http.post<{id: number, name: string, idRole: number, username: string, password: string}[]>(this.constants.webServicesUrl+'/Backoffices/BackofficeByUsername?username='+username, null);
    }

    createAndStoreOperator(name: string, role: number, username: string, password: string){
        return this.http.post(this.constants.webServicesUrl+'/Backoffices/BackofficeCreate?idRole='+role+'&name='+name+'&username='+username+'&password='+password, null);
    }

    updateOperator(id: number, name: string, role: number, username: string, password: string){
        return this.http.post(this.constants.webServicesUrl+'/Backoffices/BackofficeUpdate?id='+id+'&idRole='+role+'&name='+name+'&username='+username+'&password='+password, null);
    }

    deleteOperator(id: number){
        return this.http.post(this.constants.webServicesUrl+'/Backoffices/BackofficeDelete?id='+id, null);
    }

    fetchOperators(){
        return this.http.get<{id: number, name: string, idRole: number, username: string, password: string}[]>(this.constants.webServicesUrl+'/Backoffices');
    }
}