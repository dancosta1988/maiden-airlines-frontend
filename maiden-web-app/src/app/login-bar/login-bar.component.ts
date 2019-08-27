import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.css']
})
export class LoginBarComponent implements OnInit {
  signupForm: FormGroup;
  loginForm: FormGroup;

  constructor() { }

  ngOnInit() {
    console.log("initializing login bar...");
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

}
