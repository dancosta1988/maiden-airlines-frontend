import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Airplane } from '../airplanes/airplane.model';
import { Airport } from '../airports/airport.model';
import { Flight } from './flight.model';
import { HttpClient } from '@angular/common/http';
import { FlightsService } from './flights.service';

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
  public success = "";

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
  

  constructor(private http: HttpClient, private flightsService: FlightsService) { }

  ngOnInit() {
    //fetch
    //this.fetchFlights();

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

  populateEditForm(index: number){
    console.log("editing flight id " + this.flights[index].id);
    
        this.editForm.setValue({
          'flightId' : index,
          'flightNumber' : this.flights[index].flight_number,
          'flightDepartureDate' : this.flights[index].departure_date,
          'flightDepartureAirport' : this.flights[index].departure_airport.id,
          'flightArrivalDate' : this.flights[index].arrival_date,
          'flightArrivalAirport' : this.flights[index].arrival_airport.id,
          'flightAirplane' : this.flights[index].airplane.id,
          'flightGate' : this.flights[index].gate,
          'flightStatus' : this.flights[index].status
        });
  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      airportId : index
    });
  }

  onCreateAirport(){
    console.log("onCreateFlight");
    //send http request
    this.flightsService.createAndStoreFlight(
      this.insertForm.value.flightNumber,
      this.insertForm.value.departure_date,
      this.insertForm.value.departure_airport,
      this.insertForm.value.arrival_date,
      this.insertForm.value.arrival_airport,
      this.insertForm.value.airplane,
      this.insertForm.value.gate,
      this.insertForm.value.status
    );
  }

  
  onUpdateAirport(){
    console.log("onUpdateFlight");
    //send http request
    this.flightsService.updateFlight(
      this.flights[this.insertForm.value.flightId].id,
      this.insertForm.value.flightNumber,
      this.insertForm.value.departure_date,
      this.insertForm.value.departure_airport,
      this.insertForm.value.arrival_date,
      this.insertForm.value.arrival_airport,
      this.insertForm.value.airplane,
      this.insertForm.value.gate,
      this.insertForm.value.status
    );
  }

  onDeleteFlight(){
    console.log("onDeleteFlight");
    //get id from the deleteForm
    let index = this.deleteForm.value.flighttId;
    console.log("deleting flight id: " + this.flights[index].id);
    //send http request
    this.flightsService.deleteFlight(this.flights[index].id)

  }

  onFetchFlights(){
    this.fetchFlights();
  }

  private fetchFlights(){
    this.isFetching = true;
    this.flightsService.fetchFlights().subscribe(flights =>{
      this.isFetching = false;
      this.flights = flights;
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
