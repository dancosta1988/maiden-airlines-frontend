import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClientType } from './client-type.model';
import { ClientTypesService } from './client-types.service';

@Component({
  selector: 'app-client-types',
  templateUrl: './client-types.component.html',
  styleUrls: ['./client-types.component.css']
})
export class ClientTypesComponent implements OnInit {

  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;

  //public clientTypes: clientType[] = [];
  public isFetching = false;
  public error = "";
  public success = "";
  
  public clientTypes: ClientType[] = [ ];

   
  constructor(private clientTypesService: ClientTypesService) {}

  ngOnInit() {
    this.fetchclientTypes();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'clientTypeName' : new FormControl(null,Validators.required),
      'clientTypeAnnualFee' : new FormControl(null,Validators.required),
      'clientTypeMonthlyMiles' : new FormControl(null,Validators.required),
      'clientTypeWelcomeBonus' : new FormControl(null,Validators.required),
      'clientTypeBonusMiles' : new FormControl(null,Validators.required)
    });

    this.editForm = new FormGroup({
      'clientTypeId' : new FormControl(null),
      'clientTypeName' : new FormControl(null,Validators.required),
      'clientTypeAnnualFee' : new FormControl(null,Validators.required),
      'clientTypeMonthlyMiles' : new FormControl(null,Validators.required),
      'clientTypeWelcomeBonus' : new FormControl(null,Validators.required),
      'clientTypeBonusMiles' : new FormControl(null,Validators.required)
    });
    
    this.deleteForm = new FormGroup({
      'clientTypeId' : new FormControl(null),
    });

  }

  populateEditForm(index: number){
    console.log("editing clientType id " + this.clientTypes[index].id);
    
    
        this.editForm.setValue({
          clientTypeId : index,
          clientTypeName : this.clientTypes[index].name,
          clientTypeAnnualFee : this.clientTypes[index].annualFee,
          clientTypeMonthlyMiles : this.clientTypes[index].monthlyMiles,
          clientTypeWelcomeBonus : this.clientTypes[index].welcomeBonus,
          clientTypeBonusMiles : this.clientTypes[index].bonusMiles
        });

  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      clientTypeId : index
    });
  }

  onCreateClientType(){
    console.log("onCreateClientType");
    //send http request
    this.clientTypesService.createAndStoreClientType(
      this.insertForm.value.clientTypeName,
      this.insertForm.value.clientTypeAnnualFee,
      this.insertForm.value.clientTypeMonthlyMiles,
      this.insertForm.value.clientTypeWelcomeBonus,
      this.insertForm.value.clientTypeBonusMiles
      ).subscribe(responseData => {
        console.log(responseData);
        if(responseData){
          this.error = "Something went wrong inserting a new client type..."
        }else{
          this.success = "Client Type inserted!";
          this.fetchclientTypes();
        }
      },
      error =>{
          this.error = error.message;
      });
  }

  
  onUpdateClientType(){
    console.log("onUpdateClientType");
    //send http request
    this.clientTypesService.updateClientType(
      this.clientTypes[this.editForm.value.clientTypeId].id,
      this.editForm.value.clientTypeName,
      this.editForm.value.clientTypeAnnualFee,
      this.editForm.value.clientTypeMonthlyMiles,
      this.editForm.value.clientTypeWelcomeBonus,
      this.editForm.value.clientTypeBonusMiles 
      ).subscribe(responseData => {
        console.log(responseData);
        this.success = "ClientType updated!";
        this.fetchclientTypes();
      },
      error =>{
          this.error = error.message;
      });
  }

  onDeleteClientType(){
    console.log("onDeleteClientType");
    //get id from the deleteForm
    let index = this.deleteForm.value.clientTypeId;
    console.log("deleting clientType id: " + this.clientTypes[index].id);
    //send http request
    this.clientTypesService.deleteClientType(this.clientTypes[index].id).subscribe(responseData => {
      console.log(responseData);
      this.success = "ClientType Deleted!";
      this.fetchclientTypes();
    },
    error =>{
        this.error = error.message;
    });

  }

  onFetchclientTypes(){
    this.fetchclientTypes();
  }

  private fetchclientTypes(){
    this.isFetching = true;
    this.clientTypesService.fetchClientTypes().subscribe(clientTypes =>{
      this.isFetching = false;
      this.clientTypes = [];
        for (var i = 0, len = clientTypes.length; i < len; i++) {
          this.clientTypes.push(new ClientType(clientTypes[i].id, clientTypes[i].name, clientTypes[i].annualFee, clientTypes[i].monthlyMiles, clientTypes[i].welcomeBonus, clientTypes[i].bonusMiles));
        }
    },
    error =>{
        this.error = error.message;
    });
    
  }

  onErrorClose(){
    this.error = null;
  }

  onSuccessClose(){
    this.success = null;
  }
  

}
