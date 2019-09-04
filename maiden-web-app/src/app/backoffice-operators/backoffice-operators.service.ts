import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../common/services/constants.service';


@Injectable({providedIn: 'root'})
export class OperatorsService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    createAndStoreOperator(name: string, role: number, username: string, password: string){
        return this.http.post(this.constants.webServicesUrl+'/BackofficeCreate?idRole='+role+'&name='+name+'&username='+username+'&password='+password, null);
    }

    updateOperator(id: number, name: string, role: number, username: string, password: string){
        return this.http.post(this.constants.webServicesUrl+'/BackofficeUpdate?id='+id+'&idRole='+role+'&name='+name+'&username='+username+'&password='+password, null);
    }

    deleteOperator(id: number){
        return this.http.post(this.constants.webServicesUrl+'/BackofficeDelete?id='+id, null);
    }

    fetchOperators(){
        return this.http.get<{id: number, name: string, idRole: number, username: string, password: string}[]>(this.constants.webServicesUrl+'/Backoffices');
    }
}