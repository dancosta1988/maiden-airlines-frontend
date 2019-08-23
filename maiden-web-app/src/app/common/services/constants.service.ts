import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  //define global variables here...
  readonly webServicesUrl: string = 'http://192.168.0.77:9090';
  

  constructor() { }
}
