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
  
  public airplanes: Airplane[] = [/*
    new Airplane(1001, "Airbus A380", 500, 320),
    new Airplane(1002, "Airbus A380", 500, 320),
    new Airplane(1039, "Boeing 747", 250, 120),
    new Airplane(9288, "Boeing 747", 250, 120)
    */
  ]

   
  constructor(private http: HttpClient, private airplanesService: AirplanesService) {}

  ngOnInit() {
    this.fetchairplanes();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'airplaneId' : new FormControl(null,Validators.required),
      'airplaneModel' : new FormControl(null,Validators.required),
      'airplaneCargoholdCapacity' : new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      'airplaneSeats' : new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });

    this.editForm = new FormGroup({
      'airplaneId' : new FormControl(null),
      'airplaneModel' : new FormControl(null,Validators.required),
      'airplaneCargoholdCapacity' : new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      'airplaneSeats' : new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
    
    this.deleteForm = new FormGroup({
      'airplaneId' : new FormControl(null),
    });

  }

  populateEditForm(index: number){
    console.log("editing airplane id " + this.airplanes[index].id);
    
    
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
    console.log("onCreateAirplane");
    //send http request
    this.airplanesService.createAndStoreAirplane(
      this.insertForm.value.airplaneId,
      this.insertForm.value.airplaneModel, 
      this.insertForm.value.airplaneCargoholdCapacity, 
      this.insertForm.value.airplaneSeats).subscribe(responseData => {
        console.log(responseData);
        this.success = "Airplane inserted!";
        this.fetchairplanes();
      },
      error =>{
          this.error = error.message;
      });
  }

  
  onUpdateAirplane(){
    console.log("onUpdateAirplane");
    //send http request
    this.airplanesService.updateAirplane(
      this.editForm.value.airplaneId,
      this.editForm.value.airplaneModel, 
      this.editForm.value.airplaneCargoholdCapacity, 
      this.editForm.value.airplaneSeats).subscribe(responseData => {
        console.log(responseData);
        this.success = "Airplane updated!";
        this.fetchairplanes();
      },
      error =>{
          this.error = error.message;
      });
  }

  onDeleteAirplane(){
    console.log("onDeleteAirplane");
    //get id from the deleteForm
    let index = this.deleteForm.value.airplaneId;
    console.log("deleting airplane id: " + this.airplanes[index].id);
    //send http request
    this.airplanesService.deleteAirplane(this.airplanes[index].id).subscribe(responseData => {
      console.log(responseData);
      this.success = "Airplane Deleted!";
      this.fetchairplanes();
    },
    error =>{
        this.error = error.message;
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
