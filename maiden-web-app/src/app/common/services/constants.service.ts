import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  //define global variables here...
  readonly webServicesUrl: string = 'https://192.168.0.77:8443';
  readonly companyName: string = 'Maiden Airlines';
  readonly clubName: string = 'Club Metal Miles';
  
  

  constructor() { }
}
