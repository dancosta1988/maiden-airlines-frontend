import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../common/services/constants.service';
import { Role } from './role.model';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class RolesService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    createAndStoreRole(name: string){
        return this.http.post(this.constants.webServicesUrl+'/Roles/RoleCreate?name='+name, null);
    }

    updateRole(id: number, name: string){
        return this.http.post(this.constants.webServicesUrl+'/Roles/RoleUpdate?id='+id+'&name='+name, null);
    }

    deleteRole(id: number){
        return this.http.post(this.constants.webServicesUrl+'/Roles/RoleDelete?id='+id, null);
    }

    fetchRoles(){
        return this.http.get<Role[]>(this.constants.webServicesUrl+'/Roles');
    }

    getRoleById(id: number){
        return this.http.post(this.constants.webServicesUrl+'/Roles/RoleByID?id='+id, null);
    }
}