import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Airplane } from '../airplanes/airplane.model';
import { Airport } from '../airports/airport.model';
import { Flight } from './flight.model';
import { HttpClient } from '@angular/common/http';
import { FlightsService } from './flights.service';
import { AirportsService } from '../airports/airports.service';
import { AirplanesService } from '../airplanes/airplanes.service';
import { DatePipe } from '@angular/common';
import { BookingsService } from '../booking/booking.service';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

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
  private fetchedAirplanes = false;
  private fetchedAirports = false;
  public error = "";
  public success = "";

  public airplanes: Airplane[] = [/*
    new Airplane(1001, "Airbus A380", 500, 320),
    new Airplane(1002, "Airbus A380", 500, 320),
    new Airplane(1039, "Boeing 747", 250, 120),
    new Airplane(9288, "Boeing 747", 250, 120)*/
  ]

  public airports: Airport[] = [/*
    new Airport(1, "Aiport 1", "A1", "Lisbon", "Portugal"),
    new Airport(2, "Aiport 2", "A2", "Lisbon", "Portugal"),
    new Airport(3, "Aiport 3", "A3", "Oporto", "Portugal"),
    new Airport(4, "Aiport 4", "A4", "Madrid", "Spain")*/
  ]

  public flights: Flight[] = [
    /*
    new Flight(1, "MDN001", "2019-08-30T13:45:00", this.airports[0], "2019-08-30T15:45:00", this.airports[2], this.airplanes[1], 10, "active"),
    new Flight(2, "MDN002", "2019-08-30T16:30:00", this.airports[0], "2019-08-30T18:30:00", this.airports[3], this.airplanes[2], 5, "active"),
    new Flight(3, "MDN001", "2019-08-31T13:45:00", this.airports[0], "2019-08-30T15:45:00", this.airports[2], this.airplanes[1], 6, "delayed"),
    new Flight(4, "MDN004", "2019-08-31T13:45:00", this.airports[0], "2019-08-30T15:45:00", this.airports[3], this.airplanes[3], 2, "cancelled")
    */
  ]

  public seats: {seat:string, occupied:boolean}[] = [];

  public role:string = "";
  

  constructor( private datepipe: DatePipe, private http: HttpClient, private flightsService: FlightsService, private airportsService: AirportsService, private airplanesService: AirplanesService, private bookingsService:BookingsService) { }

  ngOnInit() {

    this.role = localStorage.getItem('role');
    
    //fetch
    this.onRefresh();
    
    //using Reactive Forms
    this.insertForm = new FormGroup({
      'flightNumber' : new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'flightDepartureDate' : new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
      'flightDepartureAirport' : new FormControl(null, Validators.required),
      'flightArrivalDate' : new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
      'flightArrivalAirport' : new FormControl(null, Validators.required),
      'flightAirplane' : new FormControl(null, Validators.required),
      'flightPrice' : new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*.[0-9][0-9]$")]),
      'flightMiles' : new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*[0-9]$")])
    });

    this.editForm = new FormGroup({
      'flightId' : new FormControl(null),
      'flightNumber' : new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'flightDepartureDate' : new FormControl(null, Validators.required),
      'flightDepartureAirport' : new FormControl(null, Validators.required),
      'flightArrivalDate' : new FormControl(null, Validators.required),
      'flightArrivalAirport' : new FormControl(null, Validators.required),
      'flightAirplane' : new FormControl(null, Validators.required),
      'flightGate' : new FormControl(null),
      'flightStatus' : new FormControl(null),
      'flightPrice' : new FormControl(null,  [Validators.required, Validators.pattern("^[0-9]*.[0-9][0-9]$")]),
      'flightMiles' : new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*[0-9]$")])
    });
    
    this.deleteForm = new FormGroup({
      'flightId' : new FormControl(null),
    });

  }

  onRefresh(){
    this.fetchAirports();
  }

  populateEditForm(index: number){
        this.editForm.setValue({
          'flightId' : index,
          'flightNumber' : this.flights[index].flight_number,
          'flightDepartureDate' : this.datepipe.transform(this.flights[index].departure_date, 'yyyy-MM-ddTHH:mm'),
          'flightDepartureAirport' : this.getAirportIndex(this.flights[index].departure_airport),
          'flightArrivalDate' : this.datepipe.transform(this.flights[index].arrival_date, 'yyyy-MM-ddTHH:mm'),
          'flightArrivalAirport' : this.getAirportIndex(this.flights[index].arrival_airport),
          'flightAirplane' : this.flights[index].airplane.id,
          'flightGate' : this.flights[index].gate,
          'flightStatus' : this.flights[index].status,
          'flightPrice' : this.flights[index].price,
          'flightMiles' : this.flights[index].miles
        });
  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      flightId : index
    });
  }

  onCreateFlight(){
    //send http request
      this.flightsService.createAndStoreFlight(
      this.insertForm.value.flightNumber,
      this.insertForm.value.flightDepartureDate,
      this.airports[this.insertForm.value.flightDepartureAirport].id,
      this.insertForm.value.flightArrivalDate,
      this.airports[this.insertForm.value.flightArrivalAirport].id,
      this.insertForm.value.flightAirplane,
      this.insertForm.value.flightPrice,
      this.insertForm.value.flightMiles
    ).subscribe(responseData => {
      if(responseData === -1){
        this.error = "Something went wrong adding the flight...";
        this.success ="";
      }else{
        this.error ="";
        this.success = "Flight added!";
        this.fetchFlights();
      }
      
  },
  error =>{
      this.success = "";
      this.error = "Something went wrong";
  });
  }

  
  onUpdateFlight(){
    //send http request
    this.flightsService.updateFlight(
      this.flights[this.editForm.value.flightId].id,
      this.editForm.value.flightNumber,
      this.editForm.value.flightDepartureDate,
      this.airports[this.editForm.value.flightDepartureAirport].id,
      this.editForm.value.flightArrivalDate,
      this.airports[this.editForm.value.flightArrivalAirport].id,
      this.editForm.value.flightAirplane,
      this.editForm.value.flightGate,
      this.editForm.value.flightStatus,
      this.editForm.value.flightPrice,
      this.editForm.value.flightMiles
    ).subscribe(responseData => {
      this.error = "";
      this.success = "Flight Updated!";
      this.fetchFlights();
  },
  error =>{
      this.success ="";
      this.error = "Something went wrong";
  });
  }

  onDeleteFlight(){
    //get id from the deleteForm
    let index = this.deleteForm.value.flightId;
    //send http request
    this.flightsService.deleteFlight(this.flights[index].id).subscribe(responseData => {
      this.error ="";
      this.success = "Flight deleted!";
      this.fetchFlights();
  },
  error =>{
      this.success ="";
      this.error = "Something went wrong";
  })

  }

  onFetchFlights(){
    this.fetchFlights();
  }

  private fetchFlights(){
    this.isFetching = true;
    
      this.flightsService.fetchFlights().subscribe(flights =>{
        this.isFetching = false;
        this.flights = [];
        for (var i = 0, len = flights.length; i < len; i++) {
          this.flights.push(new Flight(flights[i].id, flights[i].flightNumber, flights[i].departureDate, this.getAirportById(flights[i].departureAirport), flights[i].arrivalDate, this.getAirportById(flights[i].arrivalAirport), this.getAirplaneById(flights[i].idairplane), flights[i].gate, flights[i].status, flights[i].price, flights[i].miles));
        }
        this.success ="";
        this.error ="";
      },
      error =>{
          this.isFetching = false;
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

  private fetchAirplanes(){
    this.fetchedAirplanes = false;
    this.airplanesService.fetchAirplanes().subscribe(airplanes =>{
      this.airplanes = [];
      for (var i = 0, len = airplanes.length; i < len; i++) {
        this.airplanes.push(new Airplane(airplanes[i].id, airplanes[i].model, airplanes[i].cargoHoldCapacity, airplanes[i].numberSeats));
      }
      this.fetchedAirplanes = true;
      this.fetchFlights();
    },
    error =>{
        this.error = "Something went wrong";
    });
    
  }

  private fetchAirports(){
    this.fetchedAirports = false;
    this.airportsService.fetchAirports().subscribe(data =>{
        
        this.airports = [];
        for (var i = 0, len = data.length; i < len; i++) {
          this.airports.push(new Airport(data[i].id, data[i].name, data[i].shortName, data[i].city, data[i].country, data[i].imagePath));
        }
        this.fetchedAirports = true;
        this.fetchAirplanes();
      },
      error =>{
          this.error = "Something went wrong";
      });
  }

  public getAirportIndex(airport: Airport){
    return this.airports.indexOf(airport);
  }

  public getAirplaneIndex(airplane: Airplane){
    return this.airplanes.indexOf(airplane);
  }

  public getAirportById(id:number){
    let airport: Airport = this.airports.find(x => x.id === id);
    return airport;
  }

  public getAirplaneById(id:number){
    let airplane: Airplane = this.airplanes.find(x => x.id === id);
    return airplane;
  }

  public generateSeats(seats: number, flightIndex: number){

    this.bookingsService.getBookingFlightClientByFlightId(
      this.flights[flightIndex].id
    ).subscribe((responseData: {id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[] )=> {
      
      let occupiedSeats: string[] = [];
      for (var i = 0, len = responseData.length; i < len; i++) {
        if(responseData[i].seat != null){
          occupiedSeats.push(responseData[i].seat);
        }
            
      }
      this.seats = [];
      let nseats = 1;
      for (var i = 0, lenS = seats; nseats <= seats; i++ ) {
        
        for (var x = 0, len = 6; x < len && nseats <= seats ; x++, nseats++) {
          let seat = (i+1 + String.fromCharCode(97 + x)).toUpperCase();
          let occupied: boolean = occupiedSeats.includes(seat);
          this.seats.push({seat:seat, occupied: occupied});
        }
      }
      
      this.error = "";
      this.success = "Booking Updated!";
      this.onRefresh();
    },
    error =>{
        this.success ="";
        this.error = "Something went wrong";
    });



    
    
  }

}
