import { Component, OnInit, ViewChild } from '@angular/core';
import { Airport } from './airport.model';
import { HttpClient } from '@angular/common/http';
import { AirportsService } from './airports.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html',
  styleUrls: ['./airports.component.css']
})

export class AirportsComponent implements OnInit {
  
  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;

  //public airports: Airport[] = [];
  public isFetching = false;
  public error = "";
  public success = "";
  public currentlySelected = -1;
  public role = "";

  public airports: Airport[] = [
    /*new Airport(1, "Aiport 1", "A1", "Lisbon", "Portugal"),
    new Airport(2, "Aiport 2", "A2", "Lisbon", "Portugal"),
    new Airport(3, "Aiport 3", "A3", "Oporto", "Portugal"),
    new Airport(4, "Aiport 4", "A4", "Madrid", "Spain")*/
  ]

   
  constructor(private http: HttpClient, private airportsService: AirportsService) {}

  ngOnInit() {

    this.role = localStorage.getItem('role');
    this.fetchAirports();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'airportName' : new FormControl(null,Validators.required),
      'airportShortName' : new FormControl(null, Validators.required),
      'airportImagePath' : new FormControl(null, Validators.required),
      'airportCity' : new FormControl(null, Validators.required),
      'airportCountry' : new FormControl(null, Validators.required)
    });

    this.editForm = new FormGroup({
      'airportId' : new FormControl(null),
      'airportName' : new FormControl(null,Validators.required),
      'airportShortName' : new FormControl(null, Validators.required),
      'airportImagePath' : new FormControl(null, Validators.required),
      'airportCity' : new FormControl(null, Validators.required),
      'airportCountry' : new FormControl(null, Validators.required)
    });
    
    this.deleteForm = new FormGroup({
      'airportId' : new FormControl(null),
    });

  }

  populateEditForm(index: number){
    
        this.editForm.setValue({
          airportId: index,
          airportName: this.airports[index].name,
          airportShortName: this.airports[index].shortName,
          airportImagePath: this.airports[index].imagePath,
          airportCity: this.airports[index].city,
          airportCountry: this.airports[index].country
    });
  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      airportId : index
    });
  }

  onCreateAirport(){
    //send http request
    this.airportsService.createAndStoreAirport(
      this.insertForm.value.airportName, 
      this.insertForm.value.airportShortName, 
      this.insertForm.value.airportCity, 
      this.insertForm.value.airportCountry,
      this.insertForm.value.airportImagePath).subscribe(responseData => {
        this.error ="";
        this.success = "New Airport Inserted.";
        this.fetchAirports();
    },
    error =>{
      this.success ="";
        this.error = "Something went wrong";
    });
    
  }

  onUpdateAirport(){
    //send http request
    this.airportsService.updateAirport(
        this.airports[this.editForm.value.airportId].id,
        this.editForm.value.airportName, 
        this.editForm.value.airportShortName, 
        this.editForm.value.airportCity, 
        this.editForm.value.airportCountry,
        this.editForm.value.airportImagePath).subscribe(responseData => {
          this.error ="";
          this.success = "Airport Updated.";
          this.fetchAirports();
      },
      error =>{
          this.success = "";
          this.error = "Something went wrong";
      });
  }

  onDeleteAirport(){
    //get id from the deleteForm
    let index = this.deleteForm.value.airportId;
    //send http request
    this.airportsService.deleteAirport(this.airports[index].id).subscribe(responseData => {
      this.error ="";
      this.success = "Airport Deleted.";
      this.fetchAirports();
  },
  error =>{
    this.success ="";
    this.error = "Something went wrong";
  });
  }

  onFetchAirports(){
    this.fetchAirports();
  }

  private fetchAirports(){
    this.isFetching = true;
    this.airportsService.fetchAirports().subscribe(data =>{
        this.isFetching = false;
        this.airports = [];
        for (var i = 0, len = data.length; i < len; i++) {
          this.airports.push(new Airport(data[i].id, data[i].name, data[i].shortName, data[i].city, data[i].country, data[i].imagePath));
        }
        this.error ="";
        this.success ="";
      },
      error =>{
        this.success ="";
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
