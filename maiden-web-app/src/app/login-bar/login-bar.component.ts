import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { ConstantsService } from '../common/services/constants.service';
import { ClientAuthenticationService } from './login-bar.service';
import { ClientsService } from '../clients/clients.service';
import { ClientType } from '../client-types/client-type.model';
import { ClientTypesService } from '../client-types/client-types.service';
import { Client } from '../clients/client.model';

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.css']
})
export class LoginBarComponent implements OnInit {
  signupForm: FormGroup;
  loginForm: FormGroup;
  editForm: FormGroup;

  public fetchedClientTypes: boolean;
  private types: ClientType[];
  public error: string = "";
  public success: string = "";
  public name: string = "";
  public loggedIn: boolean = false;
  public currentClient: Client = null;
  

  constructor(  private constants: ConstantsService, private clientAuthService:ClientAuthenticationService, private clientsService: ClientsService, private clientTypesService:ClientTypesService ) { }

  ngOnInit() {

    if(localStorage.getItem('name')){
      this.onLogout();
    }

    this.fetchClientTypes();
    //create forms
    this.signupForm = new FormGroup({
      'signupFirstName' : new FormControl(null,Validators.required),
      'signupLastName' : new FormControl(null,Validators.required),
      'signupAddress' : new FormControl(null,Validators.required),
      'signupGender' : new FormControl(null,Validators.required),
      'signupDateOfBirth' : new FormControl(null,Validators.required),
      'signupContactNumber' : new FormControl(null,[Validators.required, Validators.maxLength(9),Validators.pattern("^[0-9]*[0-9]$")]),
      'signupNumberID' : new FormControl(null,[Validators.required, Validators.maxLength(8),Validators.pattern("^[0-9]*[0-9]$")]),
      'signupType' : new FormControl(null,Validators.required),
      'signupEmail' : new FormControl(null,[Validators.required, Validators.email]),
      'signupPassword' : new FormControl(null,Validators.required)
    });

    this.editForm = new FormGroup({
      'editFirstName' : new FormControl(null,Validators.required),
      'editLastName' : new FormControl(null,Validators.required),
      'editAddress' : new FormControl(null,Validators.required),
      'editGender' : new FormControl(null,Validators.required),
      'editDateOfBirth' : new FormControl(null,Validators.required),
      'editContactNumber' : new FormControl(null,[Validators.required, Validators.maxLength(9),Validators.pattern("^[0-9]*[0-9]$")]),
      'editNumberID' : new FormControl(null,[Validators.required, Validators.maxLength(8),Validators.pattern("^[0-9]*[0-9]$")]),
      'editType' : new FormControl(null,Validators.required),
      'editEmail' : new FormControl(null,[Validators.required, Validators.email]),
      'editPassword' : new FormControl(null,Validators.required)
    });

    this.loginForm = new FormGroup({
      'loginEmail' : new FormControl(null, Validators.required),
      'loginPassword' : new FormControl(null, Validators.required)
    });
  }

  onLogin(){
    //send http request
    this.clientAuthService.authenticate(
      this.loginForm.value.loginEmail,
      this.loginForm.value.loginPassword
      ).subscribe(responseData =>{
          this.success = "Welcome";
          this.error = "";
          let tokenStr= responseData.body;
          localStorage.setItem('token', tokenStr);
          this.getClientByUsername();
          
      },
      error =>{
        this.error = "Wrong Credentials or the authentication server is not working. " + error.message;
        this.success = "";
        this.loggedIn= false;
      });
  }

  onLogout(){
    
    this.loggedIn = false;
    localStorage.removeItem("name");
    localStorage.removeItem("clientId");
    localStorage.removeItem("token"); 
    
  }

  getClientByUsername(){ 
    //send http request
    this.clientsService.getClientByMail(
      this.loginForm.value.loginEmail,
      ).subscribe((responseData) =>{
          localStorage.setItem('name', responseData[0].firstName + " " +responseData[0].lastName);
          this.name = localStorage.getItem('name');
          localStorage.setItem('userId', responseData[0].id + "");

          this.currentClient = new Client(responseData[0].id, responseData[0].firstName, responseData[0].lastName, responseData[0].dateOfBirth, responseData[0].idNumber, responseData[0].address, responseData[0].contactNumber, responseData[0].gender, responseData[0].numberMiles, responseData[0].photo, this.getTypeById(responseData[0].idTypeClient), responseData[0].email, "" );
          //console.log(this.currentClient);
          this.loggedIn = true;
      },
      error =>{
        this.success = "";
        this.error = "Wrong Credentials or the authentication server is not working. " + error.message;
        this.loggedIn = false;
      });
  }

  onSignUp(){
    //send http request
    this.clientsService.createAndStoreClient(
      this.signupForm.value.signupFirstName,
      this.signupForm.value.signupLastName,
      this.signupForm.value.signupDateOfBirth,
      this.signupForm.value.signupNumberID,
      this.signupForm.value.signupAddress,
      this.signupForm.value.signupContactNumber,
      this.signupForm.value.signupGender, 
      "no_path",
      this.types[this.signupForm.value.signupType].id,
      this.signupForm.value.signupEmail,
      this.signupForm.value.signupPassword 
      ).subscribe(responseData => {
        if(responseData == -1){
          this.error = "Something went wrong..."
        }else{
          this.success = "You can login now!";
        }
        
      },
      error =>{
          this.error = error.message;
      });
  }

  
  onUpdateClient(){
    //send http request
    this.clientsService.updateClient(
      this.editForm.value.clientId,
      this.editForm.value.clientFirstName,
      this.editForm.value.clientLastName,
      this.editForm.value.clientDateOfBirth,
      this.editForm.value.clientNumberID,
      this.editForm.value.clientAddress,
      this.editForm.value.clientContactNumber,
      this.editForm.value.clientGender, 
      "",
      this.types[this.editForm.value.clientType].id,
      this.editForm.value.clientEmail,
      this.editForm.value.clientPassword 
      ).subscribe(responseData => {
        this.success = "Information updated!";
      },
      error =>{
          this.error = error.message;
      });
  }

  fetchClientTypes() {
    this.fetchedClientTypes = false;
    this.clientTypesService.fetchClientTypes().subscribe(clientTypes =>{
      this.fetchedClientTypes = true;
      this.types = [];
      for (var i = 0, len = clientTypes.length; i < len; i++) {
        this.types.push(new ClientType(clientTypes[i].id, clientTypes[i].name, clientTypes[i].annualFee, clientTypes[i].monthlyMiles, clientTypes[i].welcomeBonus, clientTypes[i].bonusMiles));
      }
      
    },
    error =>{
        this.error = error.message;
    });
  }

  public getTypeById(id:number){
    let clientType: ClientType = this.types.find(x => x.id === id);
    return clientType;
  }

}
