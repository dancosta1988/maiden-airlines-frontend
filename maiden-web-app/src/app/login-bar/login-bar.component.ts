import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { ConstantsService } from '../common/services/constants.service';
import { ClientAuthenticationService } from './login-bar.service';
import { ClientsService } from '../clients/clients.service';
import { ClientType } from '../client-types/client-type.model';
import { ClientTypesService } from '../client-types/client-types.service';
import { Client } from '../clients/client.model';
import { DatePipe } from '@angular/common';
import { DataService } from '../common/services/data.service';

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
  

  constructor(private data: DataService, private datepipe: DatePipe, private constants: ConstantsService, private clientAuthService:ClientAuthenticationService, private clientsService: ClientsService, private clientTypesService:ClientTypesService ) {
    this.data.currentMessage.subscribe(message => {message => {

      if(message === "updateClient")
        this.refreshClient()
      else if(message === "logoutClient")
        this.onLogout();
      }});
   }

  ngOnInit() {
    this.fetchClientTypes();
    
    this.data.currentMessage.subscribe(message => {

      if(message === "updateClient")
        this.refreshClient()
      else if(message === "logoutClient")
        this.onLogout();
      });

    if(localStorage.getItem('username')){
      this.refreshClient();
    }

    
    //create forms
    this.signupForm = new FormGroup({
      'signupFirstName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'signupLastName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'signupAddress' : new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'signupGender' : new FormControl(null,Validators.required),
      'signupDateOfBirth' : new FormControl(null,Validators.required),
      'signupContactNumber' : new FormControl(null,[Validators.required, Validators.maxLength(9),Validators.pattern("^[0-9]*[0-9]$")]),
      'signupNumberID' : new FormControl(null,[Validators.required, Validators.maxLength(8),Validators.pattern("^[0-9]*[0-9]$")]),
      'signupType' : new FormControl(null,Validators.required),
      'signupEmail' : new FormControl(null,[Validators.required, Validators.email]),
      'signupPassword' : new FormControl(null,Validators.required)
    });

    this.editForm = new FormGroup({
      'editId' : new FormControl(null,Validators.required),
      'editFirstName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'editLastName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'editAddress' : new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'editGender' : new FormControl(null,Validators.required),
      'editDateOfBirth' : new FormControl(null,Validators.required),
      'editContactNumber' : new FormControl(null,[Validators.required, Validators.maxLength(9),Validators.pattern("^[0-9]*[0-9]$")]),
      'editNumberID' : new FormControl(null,[Validators.required, Validators.maxLength(8),Validators.pattern("^[0-9]*[0-9]$")]),
      'editType' : new FormControl(null,Validators.required),
      'editEmail' : new FormControl(null,[Validators.required, Validators.email]),
      'editPassword' : new FormControl(null)
    });

    this.loginForm = new FormGroup({
      'loginEmail' : new FormControl(null, [Validators.required, Validators.email]),
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
          localStorage.setItem('username', this.loginForm.value.loginEmail);
          this.getClientByUsername();
          
          
      },
      error =>{
        this.error = "Wrong Credentials or the authentication server is not working";
        this.success = "";
        this.loggedIn= false;
      });
  }

  onLogout(){
    
    this.loggedIn = false;
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username"); 
    
  }

  refreshClient(){
    this.getClientByUsername();
  }

  getClientByUsername(){ 
    //send http request
    this.clientsService.getClientByMail(
      localStorage.getItem('username')
      ).subscribe((responseData) =>{
          localStorage.setItem('name', responseData[0].firstName + " " +responseData[0].lastName);
          this.name = localStorage.getItem('name');
          localStorage.setItem('userId', responseData[0].id + "");

          this.currentClient = new Client(responseData[0].id, responseData[0].firstName, responseData[0].lastName, responseData[0].dateOfBirth, responseData[0].idNumber, responseData[0].address, responseData[0].contactNumber, responseData[0].gender, responseData[0].numberMiles, responseData[0].photo, this.getTypeById(responseData[0].idTypeClient), responseData[0].email, "" );
          this.populateEditForm();
          this.loggedIn = true;
      },
      error =>{
        this.success = "";
        this.error = "Wrong Credentials or the authentication server is not working";
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
          this.error = "Something went wrong";
      });
  }

  
  onUpdateClient(){
    //send http request
    this.clientsService.updateClient(
      this.editForm.value.editId,
      this.editForm.value.editFirstName,
      this.editForm.value.editLastName,
      this.editForm.value.editDateOfBirth,
      this.editForm.value.editNumberID,
      this.editForm.value.editAddress,
      this.editForm.value.editContactNumber,
      this.editForm.value.editGender, 
      "",
      this.types[this.editForm.value.editType].id,
      this.editForm.value.editEmail,
      this.editForm.value.editPassword 
      ).subscribe(responseData => {
        this.success = "Information updated!";
      },
      error =>{
          this.error = "Something went wrong";
      });

      this.getClientByUsername();
  }

  populateEditForm(){    
    
    this.editForm.setValue({
      editId:this.currentClient.id,
      editFirstName: this.currentClient.firstName,
      editLastName : this.currentClient.lastName,
      editAddress : this.currentClient.address,
      editGender : this.currentClient.gender,
      editDateOfBirth : this.datepipe.transform(this.currentClient.dateOfBirth, 'yyyy-MM-dd'),
      editContactNumber : this.currentClient.contactNumber,
      editNumberID : this.currentClient.idNumber,
      editType : this.getTypeIndex(this.currentClient.type),
      editEmail : this.currentClient.email,
      editPassword : this.currentClient.password,
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
        this.error = "Something went wrong";
    });
  }

  public getTypeById(id:number){
    let clientType: ClientType = this.types.find(x => x.id === id);
    return clientType;
  }

  public getTypeIndex(type: ClientType){
    return this.types.indexOf(type);
  }

}
