import { Component, OnInit } from '@angular/core';
import { Airplane } from './airplane.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AirplanesService } from './airplanes.service';

@Component({
  selector: 'app-airplanes',
  templateUrl: './airplanes.component.html',
  styleUrls: ['./airplanes.component.css']
})

export class AirplanesComponent implements OnInit {
  
  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;

  //public airplanes: airplane[] = [];
  public isFetching = false;
  public error = "";
  public success = "";
  public role = "";
  
  public airplanes: Airplane[] = [/*
    new Airplane(1001, "Airbus A380", 500, 320),
    new Airplane(1002, "Airbus A380", 500, 320),
    new Airplane(1039, "Boeing 747", 250, 120),
    new Airplane(9288, "Boeing 747", 250, 120)
    */
  ]

   
  constructor(private http: HttpClient, private airplanesService: AirplanesService) {}

  ngOnInit() {

    this.role = localStorage.getItem('role');
    this.fetchairplanes();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'airplaneId' : new FormControl(null,Validators.required),
      'airplaneModel' : new FormControl(null,Validators.required),
      'airplaneCargoholdCapacity' : new FormControl(null, [Validators.required, Validators.maxLength(5), Validators.pattern("^[0-9]*$")]),
      'airplaneSeats' : new FormControl(null, [Validators.required, Validators.maxLength(4),Validators.pattern("^[0-9]*$")])
    });

    this.editForm = new FormGroup({
      'airplaneId' : new FormControl({disabled : true}),
      'airplaneModel' : new FormControl(null,Validators.required),
      'airplaneCargoholdCapacity' : new FormControl(null, [Validators.required, Validators.maxLength(5), Validators.pattern("^[0-9]*$")]),
      'airplaneSeats' : new FormControl(null, [Validators.required, Validators.maxLength(4),Validators.pattern("^[0-9]*$")])
    });
    
    this.deleteForm = new FormGroup({
      'airplaneId' : new FormControl(null),
    });

  }

  populateEditForm(index: number){ 
    
        this.editForm.setValue({
          airplaneId: this.airplanes[index].id,
          airplaneModel: this.airplanes[index].model,
          airplaneCargoholdCapacity: this.airplanes[index].cargoHoldCapacity,
          airplaneSeats: this.airplanes[index].numberSeats,
        });

  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      airplaneId : index
    });
  }

  onCreateAirplane(){
    //send http request
    this.airplanesService.createAndStoreAirplane(
      this.insertForm.value.airplaneId,
      this.insertForm.value.airplaneModel, 
      this.insertForm.value.airplaneCargoholdCapacity, 
      this.insertForm.value.airplaneSeats).subscribe(responseData => {
        this.error = "";
        this.success = "Airplane inserted!";
        this.fetchairplanes();
      },
      error =>{
          this.success ="";
          this.error = "Something went wrong";
      });
  }

  
  onUpdateAirplane(){
  
    //send http request
    this.airplanesService.updateAirplane(
      this.editForm.value.airplaneId,
      this.editForm.value.airplaneModel, 
      this.editForm.value.airplaneCargoholdCapacity, 
      this.editForm.value.airplaneSeats).subscribe(responseData => {
        this.error ="";
        this.success = "Airplane updated!";
        this.fetchairplanes();
      },
      error =>{
          this.success ="";
          this.error = "Something went wrong";
      });
  }

  onDeleteAirplane(){
    //get id from the deleteForm
    let index = this.deleteForm.value.airplaneId;

    //send http request
    this.airplanesService.deleteAirplane(this.airplanes[index].id).subscribe(responseData => {
      this.error = "";
      this.success = "Airplane Deleted!";
      this.fetchairplanes();
    },
    error =>{
        this.success = "";
        this.error = "Something went wrong";
    });

  }

  onFetchairplanes(){
    this.fetchairplanes();
  }

  private fetchairplanes(){
    this.isFetching = true;
    this.airplanesService.fetchAirplanes().subscribe(airplanes =>{
      this.isFetching = false;
      this.airplanes = [];
        for (var i = 0, len = airplanes.length; i < len; i++) {
          this.airplanes.push(new Airplane(airplanes[i].id, airplanes[i].model, airplanes[i].cargoHoldCapacity, airplanes[i].numberSeats));
        }
        this.error = "";
        this.success = "";
    },
    error =>{
        this.success = "";
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
