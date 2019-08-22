import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Airplane } from '../airplanes/airplane.model';
import { Airport } from '../airports/airport.model';
import { Flight } from './flight.model';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {

  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;
  
  public isFetching = false;
  public error = "";

  public airplanes: Airplane[] = [
    new Airplane(1001, "Airbus A380", 500, 320),
    new Airplane(1002, "Airbus A380", 500, 320),
    new Airplane(1039, "Boeing 747", 250, 120),
    new Airplane(9288, "Boeing 747", 250, 120)
  ]

  public airports: Airport[] = [
    new Airport(1, "Aiport 1", "A1", "Lisbon", "Portugal"),
    new Airport(2, "Aiport 2", "A2", "Lisbon", "Portugal"),
    new Airport(3, "Aiport 3", "A3", "Oporto", "Portugal"),
    new Airport(4, "Aiport 4", "A4", "Madrid", "Spain")
  ]

  public flights: Flight[] = [
    new Flight(1, "MDN001", "2019-08-30T13:45:00", this.airports[0], "2019-08-30T15:45:00", this.airports[2], this.airplanes[1], 10, "active"),
    new Flight(2, "MDN002", "2019-08-30T16:30:00", this.airports[0], "2019-08-30T18:30:00", this.airports[3], this.airplanes[2], 5, "active"),
    new Flight(3, "MDN001", "2019-08-31T13:45:00", this.airports[0], "2019-08-30T15:45:00", this.airports[2], this.airplanes[1], 6, "delayed"),
    new Flight(4, "MDN004", "2019-08-31T13:45:00", this.airports[0], "2019-08-30T15:45:00", this.airports[3], this.airplanes[3], 2, "cancelled")
  ]
  

  constructor() { }

  ngOnInit() {

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'flightNumber' : new FormControl(null,Validators.required),
      'flightDepartureDate' : new FormControl(null, Validators.required),
      'flightDepartureAirport' : new FormControl(null, Validators.required),
      'flightArrivalDate' : new FormControl(null, Validators.required),
      'flightArrivalAirport' : new FormControl(null, Validators.required),
      'flightAirplane' : new FormControl(null, Validators.required),
      'flightGate' : new FormControl(null),
      'flightStatus' : new FormControl(null, Validators.required)
    });

    this.editForm = new FormGroup({
      'flightId' : new FormControl(null),
      'flightNumber' : new FormControl(null,Validators.required),
      'flightDepartureDate' : new FormControl(null, Validators.required),
      'flightDepartureAirport' : new FormControl(null, Validators.required),
      'flightArrivalDate' : new FormControl(null, Validators.required),
      'flightArrivalAirport' : new FormControl(null, Validators.required),
      'flightAirplane' : new FormControl(null, Validators.required),
      'flightGate' : new FormControl(null),
      'flightStatus' : new FormControl(null, Validators.required)
    });
    
    this.deleteForm = new FormGroup({
      'flightId' : new FormControl(null),
    });

  }

  populateEditForm(id: number){
    console.log("editing flight id " + id);
    this.flights.forEach(element => {
      if(element.id == id){
        this.editForm.setValue({
          'flightId' : element.id,
          'flightNumber' : element.flight_number,
          'flightDepartureDate' : element.departure_date,
          'flightDepartureAirport' : element.departure_airport.id,
          'flightArrivalDate' : element.arrival_date,
          'flightArrivalAirport' : element.arrival_airport.id,
          'flightAirplane' : element.airplane.id,
          'flightGate' : element.gate,
          'flightStatus' : element.status
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
    console.log("onCreateFlight");
    //send http request
    
  }

  
  onUpdateAirport(){
    console.log("onUpdateAiport");
    //send http request
    
  }

  onDeleteAirport(){
    console.log("onDeleteAiport");
    //get id from the deleteForm
    let id = this.deleteForm.value.airportId;
    console.log("deleting airport id: " + id);
    //send http request
    

  }

  onFetchFlights(){
    this.fetchFlights();
  }

  private fetchFlights(){
    this.isFetching = true;
    //...
    
  }

}
