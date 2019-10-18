import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from './client.model';
import { ClientsService } from './clients.service';
import { ClientType } from '../client-types/client-type.model';
import { ClientTypesService } from '../client-types/client-types.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;

  //public clients: client[] = [];
  public isFetching = false;
  public error = "";
  public success = "";
  public role = "";
  public clients: Client[] = [ ];
  public types: ClientType[] = [ ];
  public fetchedClientTypes: boolean;

   
  constructor(private datepipe: DatePipe,private clientsService: ClientsService, private clientTypesService: ClientTypesService) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.onRefresh();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'clientFirstName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'clientLastName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'clientAddress' : new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'clientGender' : new FormControl(null,Validators.required),
      'clientDateOfBirth' : new FormControl(null,Validators.required),
      'clientContactNumber' : new FormControl(null,[Validators.required, Validators.maxLength(9),Validators.pattern("^[0-9]*[0-9]$")]),
      'clientNumberID' : new FormControl(null,[Validators.required, Validators.maxLength(8),Validators.pattern("^[0-9]*[0-9]$")]),
      'clientType' : new FormControl(null,Validators.required),
      'clientEmail' : new FormControl(null,[Validators.required, Validators.email]),
      'clientPassword' : new FormControl(null,Validators.required)
    });

    this.editForm = new FormGroup({
      'clientId' : new FormControl(null),
      'clientFirstName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'clientLastName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'clientAddress' : new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'clientGender' : new FormControl(null,Validators.required),
      'clientDateOfBirth' : new FormControl(null,Validators.required),
      'clientContactNumber' : new FormControl(null,[Validators.required, Validators.maxLength(9),Validators.pattern("^[0-9]*[0-9]$")]),
      'clientNumberID' : new FormControl(null,[Validators.required, Validators.maxLength(8),Validators.pattern("^[0-9]*[0-9]$")]),
      'clientType' : new FormControl(null,Validators.required),
      'clientEmail' : new FormControl(null,[Validators.required, Validators.email]),
    });
    
    this.deleteForm = new FormGroup({
      'clientId' : new FormControl(null),
    });

  }

  onRefresh() {
    this.fetchClientTypes();
    
  }

  

  populateEditForm(index: number){    
    
        this.editForm.setValue({
          clientId:index,
          clientFirstName: this.clients[index].firstName,
          clientLastName : this.clients[index].lastName,
          clientAddress : this.clients[index].address,
          clientGender : this.clients[index].gender,
          clientDateOfBirth : this.datepipe.transform(this.clients[index].dateOfBirth, 'yyyy-MM-dd'),
          clientContactNumber : this.clients[index].contactNumber,
          clientNumberID : this.clients[index].idNumber,
          clientType : this.getTypeIndex(this.clients[index].type),
          clientEmail : this.clients[index].email,
        });

  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      clientId : index
    });
  }

  onCreateClient(){
    //send http request
    this.clientsService.createAndStoreClient(
      this.insertForm.value.clientFirstName,
      this.insertForm.value.clientLastName,
      this.insertForm.value.clientDateOfBirth,
      this.insertForm.value.clientNumberID,
      this.insertForm.value.clientAddress,
      this.insertForm.value.clientContactNumber,
      this.insertForm.value.clientGender, 
      "no_path",
      this.types[this.insertForm.value.clientType].id,
      this.insertForm.value.clientEmail,
      this.insertForm.value.clientPassword 
      ).subscribe(responseData => {
        if(responseData == -1){
          this.error = "Something went wrong inserting the client..."
        }else{
          this.success = "Client inserted!";
          this.fetchclients();
        }
        
      },
      error =>{
          this.error = "Something went wrong";
      });
  }

  
  onUpdateClient(){
    //send http request
    this.clientsService.updateClient(
      this.clients[this.editForm.value.clientId].id,
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
        this.success = "Client updated!";
        this.fetchclients();
      },
      error =>{
          this.error = "Something went wrong";
      });
  }

  onDeleteClient(){
    //get id from the deleteForm
    let index = this.deleteForm.value.clientId;
    //send http request
    this.clientsService.deleteClient(this.clients[index].id).subscribe(responseData => {
      this.success = "Client Deleted!";
      this.fetchclients();
    },
    error =>{
        this.error = "Something went wrong";
    });

  }

  onFetchclients(){
    this.fetchclients();
  }

  private fetchclients(){
    this.isFetching = true;
    this.clientsService.fetchClients().subscribe(clients =>{
      this.isFetching = false;
      this.clients = [];
        for (var i = 0, len = clients.length; i < len; i++) {
          this.clients.push(new Client(clients[i].id, clients[i].firstName, clients[i].lastName, clients[i].dateOfBirth, clients[i].idNumber, clients[i].address, clients[i].contactNumber, clients[i].gender, clients[i].numberMiles, clients[i].photo, this.getTypeById(clients[i].idTypeClient), clients[i].email, clients[i].password ));
        }
    },
    error =>{
        this.error = "Something went wrong";
    });
    
  }

  onErrorClose(){
    this.error = null;
  }

  onSuccessClose(){
    this.success = null;
  }

  public getTypeById(id:number){
    let clientType: ClientType = this.types.find(x => x.id === id);
    return clientType;
  }

  public getTypeIndex(type: ClientType){
    return this.types.indexOf(type);
  }

  fetchClientTypes() {
    this.fetchedClientTypes = false;
    this.clientTypesService.fetchClientTypes().subscribe(clientTypes =>{
      this.fetchedClientTypes = true;
      this.types = [];
      for (var i = 0, len = clientTypes.length; i < len; i++) {
        this.types.push(new ClientType(clientTypes[i].id, clientTypes[i].name, clientTypes[i].annualFee, clientTypes[i].monthlyMiles, clientTypes[i].welcomeBonus, clientTypes[i].bonusMiles));
      }
      this.fetchclients();
    },
    error =>{
        this.error = "Something went wrong";
    });
  }
}
