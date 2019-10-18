import { Component, OnInit } from '@angular/core';
import { ConstantsService } from '../common/services/constants.service';
import { HttpClient } from '@angular/common/http';
import { FlightsService } from '../flights/flights.service';
import { AirportsService } from '../airports/airports.service';
import { Flight } from '../flights/flight.model';
import { Airport } from '../airports/airport.model';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public isFetching = false;
  private fetchedAirplanes = false;
  private fetchedAirports = false;
  public error = "";
  public success = "";

  
  public airports: Airport[] = [];
  public flights: Flight[] = [];
  public showflights: Flight[] = [];
  public backgrounds: string[] = ["url('assets/geneva.jpg')", "url('assets/paris.jpg')", "url('assets/london.jpg')"];

  everySecond: Observable<number> = timer(5000, 15000);
  private subscription = this.everySecond.subscribe((seconds) => {
      this.getRandomFlights();
  })

  constructor( private http: HttpClient, private flightsService: FlightsService, private airportsService: AirportsService, private constants: ConstantsService) { }

  ngOnInit() {

    this.onRefresh();
    
  }

  getBackground(i): Object{
    return { 'background': 'url('+this.showflights[i].arrival_airport.imagePath+')', 'background-size': 'cover'};
  }

  getRandomFlights(){
    this.showflights = [];
    for(let i = 0; i < 3 && this.flights.length > 0;){
      let destination:Flight = this.flights[Math.ceil(Math.random() * (this.flights.length-1))];
      if(this.showflights.indexOf(destination) < 0){
        this.showflights.push(destination);
        i++;
      }
    }
      
  }

  onRefresh(){
    this.fetchAirports();
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
          this.flights.push(new Flight(flights[i].id, flights[i].flightNumber, flights[i].departureDate, this.getAirportById(flights[i].departureAirport), flights[i].arrivalDate, this.getAirportById(flights[i].arrivalAirport), null, flights[i].gate, flights[i].status, flights[i].price, flights[i].miles));
        }
        
        this.getRandomFlights();
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


  private fetchAirports(){
    this.fetchedAirports = false;
    this.airportsService.fetchAirports().subscribe(data =>{
        
        this.airports = [];
        for (var i = 0, len = data.length; i < len; i++) {
          this.airports.push(new Airport(data[i].id, data[i].name, data[i].shortName, data[i].city, data[i].country, data[i].imagePath));
        }
        this.fetchedAirports = true;
        this.fetchFlights();

      },
      error =>{
          this.error = "Something went wrong";
      });
  }

  public getAirportIndex(airport: Airport){
    return this.airports.indexOf(airport);
  }

    public getAirportById(id:number){
    let airport: Airport = this.airports.find(x => x.id === id);
    return airport;
  }

   

}
