import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ConstantsService } from '../common/services/constants.service';

@Injectable({
    providedIn: 'root'
  })
export class BackofficeAuthenticationService {
  
    constructor( private httpClient:HttpClient, private constants: ConstantsService  ) { }
    
    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        }),
        observe: 'response'
    };
    
     
    authenticate(username: string, password: string) {
        return this.httpClient.post<any>(this.constants.webServicesUrl+'/login',{username,password},{observe: 'response'});
    }
  
    isUserLoggedIn() {
      let user = sessionStorage.getItem('username')
      return !(user === null)
    }

    logOut() {
      sessionStorage.removeItem('username')
    }
  
  }