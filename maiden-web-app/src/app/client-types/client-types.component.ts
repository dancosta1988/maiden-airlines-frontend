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
  public role ="";
  public clientTypes: ClientType[] = [ ];

   
  constructor(private clientTypesService: ClientTypesService) {}

  ngOnInit() {

    this.role = localStorage.getItem('role');
    this.fetchclientTypes();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'clientTypeName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù ]*[a-zà-ú ]*$")]),
      'clientTypeAnnualFee' : new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*.[0-9][0-9]$")]),
      'clientTypeMonthlyMiles' : new FormControl(null,[Validators.required,Validators.pattern("^[0-9]*[0-9]$")]),
      'clientTypeWelcomeBonus' : new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*[0-9]$")]),
      'clientTypeBonusMiles' : new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*[0-9]$")])
    });

    this.editForm = new FormGroup({
      'clientTypeId' : new FormControl(null),
      'clientTypeName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù ]*[a-zà-ú ]*$")]),
      'clientTypeAnnualFee' : new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*.[0-9][0-9]$")]),
      'clientTypeMonthlyMiles' : new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*[0-9]$")]),
      'clientTypeWelcomeBonus' : new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*[0-9]$")]),
      'clientTypeBonusMiles' : new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*[0-9]$")])
    });
    
    this.deleteForm = new FormGroup({
      'clientTypeId' : new FormControl(null),
    });

  }

  populateEditForm(index: number){
    
    
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
    //send http request
    this.clientTypesService.createAndStoreClientType(
      this.insertForm.value.clientTypeName,
      this.insertForm.value.clientTypeAnnualFee,
      this.insertForm.value.clientTypeMonthlyMiles,
      this.insertForm.value.clientTypeWelcomeBonus,
      this.insertForm.value.clientTypeBonusMiles
      ).subscribe(responseData => {
        if(responseData){
          this.error = "Something went wrong inserting a new client type..."
        }else{
          this.success = "Client Type inserted!";
          this.fetchclientTypes();
        }
      },
      error =>{
          this.error = "Something went wrong";
      });
  }

  
  onUpdateClientType(){
    //send http request
    this.clientTypesService.updateClientType(
      this.clientTypes[this.editForm.value.clientTypeId].id,
      this.editForm.value.clientTypeName,
      this.editForm.value.clientTypeAnnualFee,
      this.editForm.value.clientTypeMonthlyMiles,
      this.editForm.value.clientTypeWelcomeBonus,
      this.editForm.value.clientTypeBonusMiles 
      ).subscribe(responseData => {
        
        if(responseData == 0){
          this.fetchclientTypes();
          this.success = "ClientType updated!";
          this.error = "";
        }else{
          this.error = "Something went wrong";
          this.success ="";
        }
      },
      error =>{
          this.error = "Something went wrong";
      });
  }

  onDeleteClientType(){
    //get id from the deleteForm
    let index = this.deleteForm.value.clientTypeId;
    //send http request
    this.clientTypesService.deleteClientType(this.clientTypes[index].id).subscribe(responseData => {
      this.success = "ClientType Deleted!";
      this.fetchclientTypes();
    },
    error =>{
        this.error = "Something went wrong";
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
        this.error = "Something went wrong";
    });
    
  }

  onErrorClose(){
    this.error = null;
  }

  onSuccessClose(){
    this.success = null;
  }
  

}
