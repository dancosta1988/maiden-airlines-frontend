import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Operator } from '../backoffice-operators/backoffice-operator.model';
import { RolesService } from '../backoffice-roles/backoffice-roles.service';
import { OperatorsService } from '../backoffice-operators/backoffice-operators.service';
import { BackofficeAuthenticationService } from './backoffice-login.service';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { inject } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';

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
     
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private backofficeAuthService: BackofficeAuthenticationService, private rolesService: RolesService, private employeesService: OperatorsService) {}

  ngOnInit() {
    
    //using Reactive Forms
    this.loginForm = new FormGroup({
      'loginUsername' : new FormControl(null,Validators.required),
      'loginPassword' : new FormControl(null,Validators.required),
    });

    this.loggedIn = false;
    if(this.storage.get("name")){
      this.onLogout();
    }

  }

  saveInSession(key, val): void {
    this.storage.set(key, val);
    this.data[key]= this.storage.get(key);
   }

  onLogout(){
    this.loggedIn = false;
    this.data = [];
    this.storage.remove("name");
    this.storage.remove("role"); 
  }

  onLogin(){
    //send http request
    this.backofficeAuthService.authenticate(
      this.loginForm.value.loginUsername,
      this.loginForm.value.loginPassword
      ).subscribe(responseData =>{
          this.success = "Welcome";
          this.error = "";
          let tokenStr= responseData.body;
          this.storage.set('token', tokenStr);
          this.getEmployeeByUsername();
          this.loggedIn = true;
      },
      error =>{
        this.error = "Wrong Credentials or the authentication server is not working. " + error.message;
        this.success = "";
        this.loggedIn = false;
      });
  }

  getEmployeeByUsername(){
    //send http request
    this.employeesService.getOperatorByUsername(
      this.loginForm.value.loginUsername,
      ).subscribe(responseData =>{
          this.saveInSession('name', responseData[0].name);
          this.getRoleById(responseData[0].idRole);
          this.loggedIn = true;        
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
