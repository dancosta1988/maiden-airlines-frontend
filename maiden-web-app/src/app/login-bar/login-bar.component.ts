import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { ConstantsService } from '../common/services/constants.service';

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.css']
})
export class LoginBarComponent implements OnInit {
  signupForm: FormGroup;
  loginForm: FormGroup;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService,  private constants: ConstantsService ) { }

 
  public data:any=[];

  ngOnInit() {
    console.log("initializing login bar...");
    this.getFromLocal('role');

    //create forms
    this.signupForm = new FormGroup({
      'signupFirstName' : new FormControl(null,Validators.required),
      'signupLastName' : new FormControl(null, Validators.required),
      'signupAddress' : new FormControl(null, Validators.required),
      'signupVAT' : new FormControl(null, Validators.required),
      'signupDOB' : new FormControl(null, Validators.required),
      'signupGender' : new FormControl(null, Validators.required),
      'signupContact' : new FormControl(null, Validators.required),
      'signupContactType' : new FormControl(null, Validators.required),
      'signupEmail' : new FormControl(null, Validators.required),
      'signupPassword' : new FormControl(null, Validators.required),
      'signupConfirmPassword' : new FormControl(null, Validators.required)
    });

    this.loginForm = new FormGroup({
      'loginEmail' : new FormControl(null, Validators.required),
      'loginPassword' : new FormControl(null, Validators.required)
    });
  }

  onLogin(){

  }

  onSignup(){

  }

  
  getFromLocal(key): void {
    console.log('recieved= key:' + key);
    this.data[key]= this.storage.get(key);
    console.log(this.data);
   }

  isEmployee(){
    console.log("LoginBar Role: " + this.data.role);
    return this.data.role === '2' || this.data.role === '7' || this.data.role === '1';
    //return this.data.role === 'Administrator' || this.data.role === 'Client_Manager' || this.data.role === 'Manager_Operator';
  }

}
