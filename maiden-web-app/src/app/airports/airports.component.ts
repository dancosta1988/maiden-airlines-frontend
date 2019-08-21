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
  public currentlySelected = -1;
   public airports: Airport[] = [
    new Airport(1, "Aiport 1", "A1", "Lisbon", "Portugal"),
    new Airport(2, "Aiport 2", "A2", "Lisbon", "Portugal"),
    new Airport(3, "Aiport 3", "A3", "Oporto", "Portugal"),
    new Airport(4, "Aiport 4", "A4", "Madrid", "Spain")
  ]

   
  constructor(private http: HttpClient, private airportsService: AirportsService) {}

  ngOnInit() {
    this.fetchAirports();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'airportName' : new FormControl(null,Validators.required),
      'airportShortName' : new FormControl(null, Validators.required),
      'airportCity' : new FormControl(null, Validators.required),
      'airportCountry' : new FormControl(null, Validators.required)
    });

    this.editForm = new FormGroup({
      'airportId' : new FormControl(null),
      'airportName' : new FormControl(null,Validators.required),
      'airportShortName' : new FormControl(null, Validators.required),
      'airportCity' : new FormControl(null, Validators.required),
      'airportCountry' : new FormControl(null, Validators.required)
    });
    
    this.deleteForm = new FormGroup({
      'airportId' : new FormControl(null),
    });

  }

  select(id: number){
   this.currentlySelected = id; 
  }

  populateEditForm(id: number){
    console.log("editing airport id " + id);
    this.airports.forEach(element => {
      if(element.id == id){
        this.editForm.setValue({
          airportId: element.id,
          airportName: element.name,
          airportShortName: element.shortName,
          airportCity: element.city,
          airportCountry: element.country
        });
      }
    });
  }

  populateDeleteForm(id: number){
    this.deleteForm.setValue({
      airportId : id
    });
  }

  onCreateAirport(){
    console.log("onCreateAiport");
    //send http request
    this.airportsService.createAndStoreAirport(
      this.insertForm.value.airportName, 
      this.insertForm.value.airportShortName, 
      this.insertForm.value.airportCity, 
      this.insertForm.value.airportCountry);
  }

  
  onUpdateAirport(){
    console.log("onUpdateAiport");
    //send http request
    this.airportsService.updateAirport(
        this.editForm.value.airportId,
        this.editForm.value.airportName, 
        this.editForm.value.airportShortName, 
        this.editForm.value.airportCity, 
        this.editForm.value.airportCountry);
  }

  onDeleteAirport(){
    console.log("onDeleteAiport");
    //get id from the deleteForm
    let id = this.deleteForm.value.airportId;
    console.log("deleting airport id: " + id);
    //send http request
    this.airportsService.deleteAirport(id);

  }

  onFetchAirports(){
    this.fetchAirports();
  }

  private fetchAirports(){
    this.isFetching = true;
    this.airportsService.fetchAirports().subscribe(aiports =>{
      this.isFetching = false;
      this.airports = this.airports;
    });
    
  }

  

}
