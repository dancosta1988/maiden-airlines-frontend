import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Operator } from '../backoffice-operators/backoffice-operator.model';
import { RolesService } from '../backoffice-roles/backoffice-roles.service';
import { OperatorsService } from '../backoffice-operators/backoffice-operators.service';
import { BackofficeAuthenticationService } from './backoffice-login.service';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { inject } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { DataService } from '../common/services/data.service';

@Component({
  selector: 'app-backoffice-login',
  templateUrl: './backoffice-login.component.html',
  styleUrls: ['./backoffice-login.component.css']
})
export class BackofficeLoginComponent implements OnInit {

  loginForm: FormGroup;
  

  public error = "";
  public success = "";
  public loggedIn = false;
  public data:any=[];
  
  public employee: Operator; ;
     
  constructor( private backofficeAuthService: BackofficeAuthenticationService, private rolesService: RolesService, private employeesService: OperatorsService,
    private dataService: DataService) {}

  ngOnInit() {
    
    //using Reactive Forms
    this.loginForm = new FormGroup({
      'loginUsername' : new FormControl(null,Validators.required),
      'loginPassword' : new FormControl(null,Validators.required),
    });

    this.loggedIn = false;
    if(localStorage.getItem("name")){
      this.onLogout();
    }

  }

  saveInSession(key:string, val:string): void {
    localStorage.setItem(key, val);
    this.data[key]= localStorage.getItem(key);
   }

  onLogout(){
    this.loggedIn = false;
    this.data = [];
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("token"); 
  }

  onLogin(){
    this.dataService.logoutClient();

    //send http request
    this.backofficeAuthService.authenticate(
      this.loginForm.value.loginUsername,
      this.loginForm.value.loginPassword
      ).subscribe(responseData =>{
          this.success = "Welcome";
          this.error = "";
          let tokenStr= responseData.body;
          localStorage.setItem('token', tokenStr);
          this.getEmployeeByUsername();
          
      },
      error =>{
        this.error = "Wrong Credentials or the authentication server is not working. " + error.message;
        this.success = "";
        this.loggedIn= false;
      });
  }

  getEmployeeByUsername(){
    //send http request
    this.employeesService.getOperatorByUsername(
      this.loginForm.value.loginUsername,
      ).subscribe(responseData =>{
          localStorage.setItem('name', responseData[0].name);
          this.saveInSession('name', responseData[0].name);
          this.getRoleById(responseData[0].idRole);        
      },
      error =>{
        this.success = "";
        this.error = "Wrong Credentials or the authentication server is not working. " + error.message;
        this.loggedIn = false;
      });
  }

  getRoleById(roleId: number){
    //send http request
    this.rolesService.getRoleById(
      roleId
    ).subscribe(responseData =>{
        localStorage.setItem('role', responseData[0].name);
        this.saveInSession('role', responseData[0].name);
        this.loggedIn = true;        
    },
    error =>{
        this.success = "";
        this.error = "Wrong Credentials or the authentication server is not working. " + error.message;
        this.loggedIn = false;
    });
    
  }

  onErrorClose(){
    this.error = null;
  }

  onSuccessClose(){
    this.success = null;
  }


}
