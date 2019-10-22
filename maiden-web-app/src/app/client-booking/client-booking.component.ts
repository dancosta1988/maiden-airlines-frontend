import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Flight } from '../flights/flight.model';
import { Client } from '../clients/client.model';
import { ClientType } from '../client-types/client-type.model';
import { Airport } from '../airports/airport.model';
import { Airplane } from '../airplanes/airplane.model';
import { Booking } from '../booking/booking.model';
import { BookingType } from '../booking-types/booking-type.model';
import { DatePipe, formatDate } from '@angular/common';
import { FlightsService } from '../flights/flights.service';
import { AirportsService } from '../airports/airports.service';
import { AirplanesService } from '../airplanes/airplanes.service';
import { BookingTypesService } from '../booking-types/booking-types-service';
import { ClientsService } from '../clients/clients.service';
import { ClientTypesService } from '../client-types/client-types.service';
import { BookingsService } from '../booking/booking.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../common/services/data.service';
import { ConstantsService } from '../common/services/constants.service';

@Component({
  selector: 'app-client-booking',
  templateUrl: './client-booking.component.html',
  styleUrls: ['./client-booking.component.css']
})
export class ClientBookingComponent implements OnInit {
  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;
  searchForm: FormGroup;
  checkinForm: FormGroup;

  public isFetching = false;
  private fetchedFlights = false;
  private fetchedAirplanes = false;
  private fetchedAirports = false;
  private fetchedClientTypes = false;
  private checking = false;
  private booking = false;
  
  public role = "";
  public error = "";
  public success = "";
  public checkinError = "";
  public checkinSuccess = "";
  public changeDate: boolean = false;
  public cancelBooking: boolean = false;

  public currentBookingIndex = null;
  public currentPage: number = 1;
  public outFlightId: number = null;
  public returnFlightId: number = null;
  public currentCheckinIndex = -1;
  public currentClient: Client = null;
  public clientTypes: ClientType[] = [ ];
  public additionalPassengers: { 
      id: number,
      firstName: string,
      lastName: string,
      dateOfBirth: string,
      idNumber: string,
      address: string,
      contactNumber: number,
      gender: string,
      numberMiles: number,
      photo: string,
      idTypeClient: number,
      email: string,
      password: string, 
    }[] = [ ];
  public outboundFlights: Flight[] = [ ];
  public returnFlights: Flight[] = [ ];
  public flights: Flight[] = [ ];
  public clients: Client[] = [ ];
  public airports: Airport[] = [ ];
  public airplanes: Airplane[] = [ ];
  public bookings: Booking[] = [ ];
  public types: BookingType[] = [ ];
  public checkin: {id: number, booking: Booking, client: Client, flight: Flight, checkin: boolean, seat: string}[] = [];
  public seats: {seat:string, occupied: boolean, passengerSeat: boolean}[] = [];
  

  constructor(
    private datepipe: DatePipe, 
    private http: HttpClient,
    private constants: ConstantsService,
    private flightsService: FlightsService, 
    private airportsService: AirportsService, 
    private airplanesService: AirplanesService, 
    private bookingTypesService: BookingTypesService, 
    private clientsService: ClientsService, 
    private clientTypesService: ClientTypesService,
    private bookingsService: BookingsService,
    private data: DataService) { }

  ngOnInit() {
    
    this.getClientByID();
    //fetch
    this.onRefresh();
    console.log(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'bookingClient' : new FormControl(null,Validators.required),
      'bookingDepartureAirport' : new FormControl(null,Validators.required),
      'bookingArrivalAirport' : new FormControl(null, Validators.required),
      'bookingType' : new FormControl(null, Validators.required),
      'bookingDepartureDate' : new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
      'bookingArrivalDate' : new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
      'bookingOutboundFlight' : new FormControl(null, Validators.required),
      'bookingReturnFlight' : new FormControl(null, Validators.required),
      'bookingReturn' : new FormControl('false', Validators.required),
      'bookingFirstName' : new FormControl(null, [Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'bookingLastName' : new FormControl(null, [Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'bookingDateOfBirth' : new FormControl(null, Validators.required),
      'bookingGender' : new FormControl(null, Validators.required),
      'bookingAddress' : new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'bookingContactNumber' : new FormControl(null, [Validators.required, Validators.maxLength(9), Validators.pattern("^[0-9]*[0-9]$")]),
      'bookingIDNumber' : new FormControl(null, Validators.required),
      'bookingID' : new FormControl({disabled: true}, Validators.required),
      'bookingFlightCost' : new FormControl({disabled: true}, Validators.required),
      'bookingTotalCost' : new FormControl({disabled: true}, Validators.required),
      'bookingTypeCost' : new FormControl({disabled: true}, Validators.required),
      'bookingCardNumber' : new FormControl(null, [Validators.required, Validators.maxLength(16), Validators.minLength(16),Validators.pattern("^[0-9]*[0-9]$")]),
      'bookingCardSecurity' : new FormControl(null, [Validators.required, Validators.maxLength(3), Validators.minLength(3),Validators.pattern("^[0-9]*[0-9]$")]),

    });

    this.editForm = new FormGroup({
      'bookingType' : new FormControl(null, Validators.required),
      'bookingDepartureAirport' : new FormControl(null,Validators.required),
      'bookingArrivalAirport' : new FormControl(null, Validators.required),
      'bookingDepartureDate' : new FormControl(null, Validators.required),
      'bookingArrivalDate' : new FormControl(null, Validators.required),
      'bookingOutboundFlight' : new FormControl(null, Validators.required),
      'bookingReturnFlight' : new FormControl(null),
      'bookingId' : new FormControl(null, Validators.required),
    });
    
    this.deleteForm = new FormGroup({
      'bookingId' : new FormControl(null),
    });

    this.searchForm = new FormGroup({
      'bookingId' : new FormControl(null,[Validators.required,Validators.pattern("^[0-9]*[0-9]$")]),
    });

  }

  getClientById(clientId: number){

    
      //send http request
      this.clientsService.getClientById(
        clientId,
        ).subscribe((responseData) =>{
           this.clients.push( new Client(responseData[0].id, responseData[0].firstName, responseData[0].lastName, responseData[0].dateOfBirth, responseData[0].idNumber, responseData[0].address, responseData[0].contactNumber, responseData[0].gender, responseData[0].numberMiles, responseData[0].photo, this.getTypeById(responseData[0].idTypeClient), responseData[0].email, "" ));
           
        },
        error =>{
          this.success = "";
          this.error = "";
          
        });

     
  }

  getClientByID(){

    if(localStorage.getItem('userId')){
      //send http request
      this.clientsService.getClientById(
        parseInt(localStorage.getItem('userId')),
        ).subscribe((responseData) =>{
            this.currentClient = new Client(responseData[0].id, responseData[0].firstName, responseData[0].lastName, responseData[0].dateOfBirth, responseData[0].idNumber, responseData[0].address, responseData[0].contactNumber, responseData[0].gender, responseData[0].numberMiles, responseData[0].photo, this.getTypeById(responseData[0].idTypeClient), responseData[0].email, "" );
           
        },
        error =>{
          this.success = "";
          this.error = "";
          
        });
      }else{

      }
  }

  private canChangeDate (bookingIndex: number){
    let index = bookingIndex;
    let result: boolean = false;
    
    if(index != null && this.bookings.length > index && this.bookings[index] != undefined){
      this.editForm.patchValue({
        'bookingType': this.getBookingTypeById(this.bookings[index].bookingType).name
      });
      result = this.getBookingTypeById(this.bookings[index].bookingType).changeDate == "true";
      return result;
    }else{
      return result;
    }
  }

  public isCheckinOpen(bookingClientFlightIndex: number){
      let today = new Date();
      let departure = new Date(this.checkin[bookingClientFlightIndex].flight.departure_date);
      let difference_In_Time = departure.getTime() - today.getTime(); 
      console.log(difference_In_Time / (1000 * 3600 * 24));
      return (difference_In_Time / (1000 * 3600 * 24)) <= 2 && (difference_In_Time / (1000 * 3600 * 24)) >= 0; 
  }

  private canCancelBooking(index: number){
    
    let result: boolean = false;
    
    if(index != null && this.bookings.length > index && this.bookings[index] != undefined){
      result = this.getBookingTypeById(this.bookings[index].bookingType).cancelBooking == "true";
      return result;
    }else{
      return result;
    }
  }

  public greaterThan(date1: string, date2: string){
    let firstDate:Date;
    let secondDate:Date;
    
    if(date1 == '')
      firstDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    else
      firstDate = new Date(this.datepipe.transform(new Date(date1), 'yyyy-MM-dd'));

    if(date2 == '')
      secondDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    else
      secondDate = new Date(this.datepipe.transform(new Date(date2), 'yyyy-MM-dd'));
    
      
    return firstDate.getTime()<= secondDate.getTime();
  }


  onRefresh(){
    this.fetchAirplanes();
    this.fetchAirports();
    this.fetchbookingTypes();
  }

  populateCheckinForm(bookingIndex: number){
      //send http request
      this.checkin =[];
      this.bookingsService.getBookingFlightClientByBookingId(
      this.bookings[bookingIndex].id
      ).subscribe((responseData: {id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[] )=> {
              
        for (var i = 0, len = responseData.length; i < len; i++) {
          if(responseData[i].id != null){
            this.checkin.push({"id" : responseData[i].id, "booking" : this.getBookingById(responseData[i].idBooking), "client" : this.getClientFromListByID(responseData[i].idClient), "flight": this.getFlightByID(responseData[i].idFlight), "checkin": responseData[i].checkIn, "seat" :responseData[i].seat});
          }
        }
        
        this.checkinError = "";
        this.checkinSuccess = "";
      },
      error =>{
          this.checkinSuccess ="";
          this.checkinError = "Something went wrong";
      });

  }

  populateEditForm(index: number){
    this.currentBookingIndex = index;
    this.bookingsService.getBookingFlightClientByBookingId(this.bookings[index].id).subscribe(
      (bookingClientFlight: {id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[]) =>{
        
        this.outboundFlights = [];
        this.returnFlights = [];
        this.outFlightId = null;
        this.returnFlightId = null;


        for(let i = 0; i < bookingClientFlight.length; i++){
          if(i == 0){
            this.outFlightId = bookingClientFlight[i].idFlight;
            this.fetchOutboundFlights(this.datepipe.transform(this.getFlightByID(bookingClientFlight[i].idFlight).departure_date,"yyyy-MM-dd"), this.getFlightByID(bookingClientFlight[i].idFlight).departure_airport.id, this.getFlightByID(bookingClientFlight[i].idFlight).arrival_airport.id); 
          }else if(this.outFlightId != null && this.outFlightId != bookingClientFlight[i].idFlight ){
            this.returnFlightId = bookingClientFlight[i].idFlight;
            this.fetchReturnFlights(this.datepipe.transform(this.getFlightByID(bookingClientFlight[i].idFlight).departure_date, "yyyy-MM-dd"), this.getFlightByID(bookingClientFlight[i].idFlight).departure_airport.id, this.getFlightByID(bookingClientFlight[i].idFlight).arrival_airport.id); 
            break;
          }

        }

            
        
        this.editForm.patchValue({
          'bookingId' : index,
          'bookingDepartureAirport' : this.getAirportIndex(this.getFlightByID(this.outFlightId).departure_airport),
          'bookingArrivalAirport' : this.getAirportIndex(this.getFlightByID(this.outFlightId).arrival_airport),
          'bookingDepartureDate' : this.datepipe.transform(this.getFlightByID(this.outFlightId).departure_date, 'yyyy-MM-dd'),
          'bookingOutboundFlight' : this.getOutboundFlightIndex(this.getFlightByID(this.outFlightId)),
        });

        if(this.returnFlightId != null){
          this.editForm.patchValue({
            'bookingArrivalDate' : this.datepipe.transform(this.getFlightByID(this.returnFlightId).departure_date,'yyyy-MM-dd'),
            'bookingReturnFlight' : this.getReturnFlightIndex(this.getFlightByID(this.returnFlightId)),
          });
        }

        let canChange:boolean = this.canChangeDate(index);
        
        if(!canChange){
          this.editForm.disable();
          this.changeDate = false;
        }else{
          this.editForm.enable();
          this.editForm.get('bookingDepartureAirport').disable();
          this.editForm.get('bookingArrivalAirport').disable();
          this.editForm.get('bookingType').disable();
          this.changeDate = true;
        }

      },
      error =>{
        this.checkinSuccess ="";
        this.checkinError = "Something went wrong";
    });
    
  }

  onOutboundDateChange(){
    this.fetchOutboundFlights(this.datepipe.transform(this.editForm.getRawValue().bookingDepartureDate,"yyyy-MM-dd"), this.airports[this.editForm.getRawValue().bookingDepartureAirport].id, this.airports[this.editForm.getRawValue().bookingArrivalAirport].id); 
  }

  onReturnDateChange(){
    this.fetchReturnFlights(this.datepipe.transform(this.editForm.getRawValue().bookingArrivalDate,"yyyy-MM-dd"), this.airports[this.editForm.getRawValue().bookingArrivalAirport].id, this.airports[this.editForm.getRawValue().bookingDepartureAirport].id); 
  }


  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      bookingId : index
    });

    let canCancel:boolean = this.canCancelBooking(index);
        
    if(!canCancel){
      this.deleteForm.disable();
      this.cancelBooking = false;
    }else{
      this.deleteForm.enable();
      this.cancelBooking = true;
    }
  }

  onCreateBooking(){
    if(this.currentClient == null)
      this.getClientByID();
    if(this.insertForm.value.bookingClient != null || this.currentClient != null){
          this.booking = true;
          //send http request
          let selectedFlights: {id: number}[] = [];
          selectedFlights.push({id : this.outboundFlights[0].id});
          if(this.returnFlights.length > 0 )
            selectedFlights.push({id:this.returnFlights[0].id});
          this.bookingsService.createAndStoreBooking(
          new Booking(null, this.currentClient.id,this.insertForm.value.bookingDate, this.types[this.insertForm.value.bookingType].id, this.additionalPassengers, selectedFlights)
          
          ).subscribe(responseData => {
            this.success = "Flight Reserved";
            this.error ="";
            this.next();
            
            this.insertForm.patchValue({
              "bookingID": responseData["BookingID"],
              "bookingTotalCost" : responseData["TotalCost"]+'€',
              "bookingFlightCost" : responseData["Flights"]+'€',
              "bookingTypeCost" : responseData["BookingTypeCost"]+'€'
          });
          
          this.booking = false;
          
      },
      error =>{
          this.success = "";
          this.error = "Something went wrong";
          this.booking = false;
      });
    }else{
      this.error = "Please Login or Signup if you don't have an account!";
      this.success = "";
    }
  }

  
  onUpdateBooking(){

    this.bookingsService.getBookingFlightClientByBookingId(
      this.bookings[this.editForm.getRawValue().bookingId].id
    ).subscribe((responseData: {id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[] )=> {
            
      for (var i = 0, len = responseData.length; i < len; i++) {
        if(responseData[i].id != null){

          if(responseData[i].idFlight == this.outFlightId){
            //send http request
            this.bookingsService.updateBookingFlightClient(
                responseData[i].id,
                this.outboundFlights[this.editForm.getRawValue().bookingOutboundFlight].id,
                responseData[i].idClient
              ).subscribe(responseData => {
                this.error = "";
                this.success = "";
                //this.fetchFlights();
            },
            error =>{
                this.success ="";
                this.error = "Something went wrong";
            });

          }else if(this.returnFlightId != null && responseData[i].idFlight == this.returnFlightId){
            //send http request
            this.bookingsService.updateBookingFlightClient(
                responseData[i].id,
                this.returnFlights[this.editForm.getRawValue().bookingReturnFlight].id,
                responseData[i].idClient
              ).subscribe(responseData => {
                this.error = "";
                this.success = "";
                //this.fetchFlights();
            },
            error =>{
                this.success ="";
                this.error = "Something went wrong";
            });
          }


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

  onDeleteBooking(){
    //get id from the deleteForm
    let index = this.deleteForm.value.bookingId;
    //send http request
    this.bookingsService.deleteBooking(this.bookings[index].id).subscribe(responseData => {
      this.error ="";
      this.success = "Booking deleted!";
      this.onRefresh();
    },
  error =>{
      this.success ="";
      this.error = "Something went wrong";
  })

  }

  onCheckin(flightId: number, bookingClientFlightIndex: number){
    this.currentCheckinIndex = -1;
    let booking_flights_clients: {id: number, booking: Booking, client: Client, flight: Flight, checkin: boolean, seat: string}[] = [];
    this.checkinError = "";
    this.checkinSuccess = "";

    //send http request
    this.bookingsService.getBookingFlightClientByFlightId(
      flightId
    ).subscribe((responseData: {id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[] )=> {
      
    
      for (var i = 0, len = responseData.length; i < len; i++) {
        if(responseData[i].id != null){
          booking_flights_clients.push({"id" : responseData[i].id, "booking" : this.getBookingById(responseData[i].idBooking), "client" : this.currentClient, "flight": this.getFlightById(responseData[i].idFlight), "checkin": responseData[i].checkIn, "seat" :responseData[i].seat});
        }
      }
      
      this.checkinError = "";
      this.checkinSuccess = "";
      //generate a seat
      let seats = this.getFlightByID(flightId).airplane.numberSeats;
      let assignedSeat = "";
      let nseats = 1;
      for (var i = 0, lenS = seats; nseats <= seats && assignedSeat == ""; i++ ) {
        for (var x = 0, len = 6; x < len && nseats <= seats && assignedSeat == ""; x++, nseats++) {
          let genSeat = (i+1 + String.fromCharCode(97 + x)).toUpperCase();
          if(!this.isSeatOccupied(genSeat, booking_flights_clients)){
            assignedSeat = genSeat;
          }
        }
      }

      //checkin
      if(assignedSeat != ""){
        this.checkingIn(this.checkin[bookingClientFlightIndex],this.checkin[bookingClientFlightIndex].id,assignedSeat, this.checkin[bookingClientFlightIndex].client.id, this.checkin[bookingClientFlightIndex].flight.id );

        //check if there is a child in the reservation
        for(let x = 0; x < this.checkin.length; x++){
          
          let born = this.checkin[x].client.dateOfBirth;
          if (this.checkin[bookingClientFlightIndex].flight.id == this.checkin[x].flight.id && this.isChild(born) && (this.checkin[x].seat == "" || this.checkin[x].seat == null)){
            //if exists checkin in the same seat
            this.checkingIn(this.checkin[x],this.checkin[x].id,assignedSeat, this.checkin[x].client.id, this.checkin[x].flight.id);
          }
          
        }

      }else{
        this.checkinError = "Could not find a free seat.";
        this.checkinSuccess = "";
      }


    },
    error =>{
        this.checkinSuccess ="";
        this.checkinError = "Something went wrong";
    });

  }

  public isChild(born: string){
    let today = new Date();
    let bornDate = new Date(born);
    let difference_In_Time = today.getTime() - bornDate.getTime();
    let result = Math.abs(Math.round(difference_In_Time / (1000 * 60 * 60 * 24 * 365.25)));
    console.log("years:" + result);
    return (result <= 2);
  }

  private isSeatOccupied(seat:string, bookings:{id: number, booking: Booking, client: Client, flight: Flight, checkin: boolean, seat: string}[]){
      for(var x = 0, len = bookings.length; x < len; x++){
        if(seat == bookings[x].seat){
          return true;
        }
      }
      return false;
  }

  public onAddPassenger(){
    let passenger: { 
      id: number,
      firstName: string,
      lastName: string,
      dateOfBirth: string,
      idNumber: string,
      address: string,
      contactNumber: number,
      gender: string,
      numberMiles: number,
      photo: string,
      idTypeClient: number,
      email: string,
      password: string, 
  } = {
    id : null, 
    firstName: this.insertForm.value.bookingFirstName,
    lastName: this.insertForm.value.bookingLastName,
    dateOfBirth: this.insertForm.value.bookingDateOfBirth,
    idNumber: this.insertForm.value.bookingIDNumber,
    address: this.insertForm.value.bookingAddress,
    contactNumber: this.insertForm.value.bookingContactNumber,
    gender: this.insertForm.value.bookingGender,
    numberMiles: 0,
    photo: null,
    idTypeClient: 6,
    email: null,
    password: null, 
  }
    this.additionalPassengers.push(JSON.parse(JSON.stringify(passenger)));
      
  }

  private checkingIn(booking: {id: number, booking: Booking, client: Client, flight: Flight, checkin: boolean, seat: string},clientbookingflightId: number, seat: string, idClient: number, idFlight: number){
    this.checkinError ="";
    this.checkinSuccess = "";
    this.checking = true;
    this.bookingsService.checkin(clientbookingflightId, seat, idClient, idFlight).subscribe(responseData => {
      this.checkinError ="";
      this.checkinSuccess = "Checked In!";
      this.populateCheckinForm(this.getBookingIndex(this.getBookingById(booking.booking.id)));
      this.data.refreshClient();
      this.checking = false;
    },
    error =>{
        this.checkinSuccess ="";
        this.checkinError = "Something went wrong checking in. Please try again.";
        this.checking = false;
    });

  }

  private fetchOutboundFlights(departureDate: string,departureAirport: number,arrivalAirport:number){
    this.isFetching = true;
    
      this.flightsService.fetchFlightsByDateAndAirports(departureDate,departureAirport,arrivalAirport).subscribe(flights =>{
        this.isFetching = false;
        this.outboundFlights = [];
        for (var i = 0, len = flights.length; i < len; i++) {
          if(flights[i].flightNumber != "" && flights[i].status != "Cancelled"){
            this.outboundFlights.push(new Flight(flights[i].id, flights[i].flightNumber, flights[i].departureDate, this.getAirportById(flights[i].departureAirport), flights[i].arrivalDate, this.getAirportById(flights[i].arrivalAirport), this.getAirplaneById(flights[i].idairplane), flights[i].gate, flights[i].status, flights[i].price, flights[i].miles));
          }
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

  private fetchReturnFlights(departureDate: string,departureAirport: number,arrivalAirport:number){
    this.isFetching = true;
    
      this.flightsService.fetchFlightsByDateAndAirports(departureDate,departureAirport,arrivalAirport).subscribe(flights =>{
        this.isFetching = false;
        this.returnFlights = [];
        for (var i = 0, len = flights.length; i < len; i++) {
          if(flights[i].flightNumber != "" && flights[i].status != "Cancelled"){
            this.returnFlights.push(new Flight(flights[i].id, flights[i].flightNumber, flights[i].departureDate, this.getAirportById(flights[i].departureAirport), flights[i].arrivalDate, this.getAirportById(flights[i].arrivalAirport), this.getAirplaneById(flights[i].idairplane), flights[i].gate, flights[i].status, flights[i].price, flights[i].miles));
          }
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
    },
    error =>{
        this.error = "Something went wrong";
    });
    
  }

  private fetchBookings(){
    this.isFetching = true;
    
      this.bookingsService.fetchBookings().subscribe(bookings =>{
        this.isFetching = false;
        this.bookings = [];
        for (var i = 0, len = bookings.length; i < len; i++) {
          this.bookings.push(new Booking(bookings[i].id, null, bookings[i].date, bookings[i].bookingType, null, null ));
        }
        this.success ="";
        this.error ="";
      },
      error =>{
          this.isFetching = false;
          this.success ="";
          this.error = "Something went wrong getting the information about the booking";
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
      },
      error =>{
          this.error = "Something went wrong";
      });
  }

  private fetchbookingTypes(){
    this.isFetching = true;
    this.bookingTypesService.fetchBookingTypes().subscribe(bookingTypes =>{
      this.isFetching = false;
      this.types = [];
      this.types = bookingTypes;
      
    },
    error =>{
        this.error = "Something went wrong";
    });
    
  }

  private getFlightsAndClientsByBookingId(bookingId: number){
    
    this.bookingsService.getBookingFlightClientByBookingId(
      bookingId
    ).subscribe((responseData: {id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[] )=> {

      this.clients = [];
      this.flights = [];
      for (var i = 0, len = responseData.length; i < len; i++) {
        if(responseData[i].id != null){

          this.getClientById(responseData[i].idClient);
          this.getFlightById(responseData[i].idFlight);
        }
      }
      
      this.error = "";
      this.success = "";
      this.onRefresh();
    },
    error =>{
        this.success ="";
        this.error = "Something went wrong";
    });
  }

  
  public getAirportIndex(airport: Airport){
    return this.airports.findIndex(i => i.id === airport.id);
  }

  public getAirplaneIndex(airplane: Airplane){
    return this.airplanes.indexOf(airplane);
  }

  public getBookingIndex(booking: Booking){
    return this.bookings.indexOf(booking);
  }

  public getOutboundFlightIndex(flight: Flight){
    return this.outboundFlights.indexOf(flight);
  }

  public getReturnFlightIndex(flight: Flight){
    return this.returnFlights.indexOf(flight);
  }

  public getAirportById(id:number){
    let airport: Airport = this.airports.find(x => x.id === id);
    return airport;
  }

  public getAirplaneById(id:number){
    let airplane: Airplane = this.airplanes.find(x => x.id === id);
    return airplane;
  }

  public getBookingById(id:number){
    let booking: Booking = this.bookings.find(x => x.id === id);
    return booking;
  }

  public getClientFromListByID(id:number){
    let client: Client = this.clients.find(x => x.id === id);
    return client;
  }

  public getFlightByID(id:number){
    let flight: Flight = this.flights.find(x => x.id === id);
    return flight;
  }



  public getBookingByNumber(){
    this.isFetching = true;
    
      this.bookingsService.getBookingById(this.searchForm.value.bookingId).subscribe(bookings =>{
        this.isFetching = false;
        this.bookings = [];
        for (var i = 0, len = bookings.length; i < len; i++) {
          this.bookings.push(new Booking(bookings[i].id, null, bookings[i].date, bookings[i].bookingType, null, null ));
          this.getFlightsAndClientsByBookingId(bookings[i].id);
        }
        this.success ="";
        this.error ="";
      },
      error =>{
          this.isFetching = false;
          this.success ="";
          this.error = "Please Login our Signup if you don't have an account!";
      });
  }


  public getFlightById(flightId: number){
    this.isFetching = true;
    
    this.flightsService.fetchFlightsById(flightId).subscribe(flights =>{
        this.isFetching = false;
        this.success ="";
        this.error ="";
        this.flights.push( new Flight(flights[0].id, flights[0].flightNumber, flights[0].departureDate, this.getAirportById(flights[0].departureAirport),flights[0].arrivalDate, this.getAirportById(flights[0].arrivalAirport), this.getAirplaneById(flights[0].idairplane),flights[0].gate, flights[0].status, flights[0].price, flights[0].miles));
        
      },
      error =>{
          this.isFetching = false;
          this.success ="";
          this.error = "Something went wrong";
          return null;
      });

      return null;
  }


  drawSeats(flightId: number, checkinIndex: number){
    //this.generateSeats(this.getFlightByID(flightId).airplane.numberSeats);
    this.currentCheckinIndex = checkinIndex;
    this.bookingsService.getBookingFlightClientByFlightId(
      flightId
    ).subscribe((responseData: {id: number, idBooking: number, idClient: number, idFlight: number, checkIn: boolean, seat: string}[] )=> {
      
      let occupiedSeats: string[] = [];
      for (var i = 0, len = responseData.length; i < len; i++) {
        if(responseData[i].seat != null){
          occupiedSeats.push(responseData[i].seat);
        }
            
      }
      this.seats = [];
      let nseats = 1;
      for (var i = 0, lenS = this.getFlightByID(flightId).airplane.numberSeats; nseats <= lenS; i++ ) {
        
        for (var x = 0, len = 6; x < len && nseats <= lenS ; x++, nseats++) {
          let seat = (i+1 + String.fromCharCode(97 + x)).toUpperCase();
          let occupied: boolean = occupiedSeats.includes(seat);
          let passenger: boolean = this.checkin[checkinIndex].seat == seat;
          this.seats.push({seat:seat, occupied: occupied, passengerSeat: passenger});
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

  changeSeat(seat: string){
    this.checkingIn(this.checkin[this.currentCheckinIndex],this.checkin[this.currentCheckinIndex].id,seat, this.checkin[this.currentCheckinIndex].client.id, this.checkin[this.currentCheckinIndex].flight.id );
    //check if there is a child in the reservation
    for(let x = 0; x < this.checkin.length; x++){
          
      let born = this.checkin[x].client.dateOfBirth;
      if (this.checkin[this.currentCheckinIndex].flight.id == this.checkin[x].flight.id && this.isChild(born)){
        //if exists checkin in the same seat
        this.checkingIn(this.checkin[x],this.checkin[x].id,seat, this.checkin[x].client.id, this.checkin[x].flight.id);
      }

      this.currentCheckinIndex = -1;
      this.seats = [];

    }
  }


  public generateSeats(seats: number){
    this.seats = [];
    let nseats = 1;
    for (var i = 0, lenS = seats; nseats <= seats; i++ ) {
      
      for (var x = 0, len = 6; x < len && nseats <= seats ; x++, nseats++) {
        this.seats.push({seat: i+1 + String.fromCharCode(97 + x).toUpperCase(), occupied: false, passengerSeat: false});
      }
    }
    
  }
  
  public getTypeById(id:number){
    let clientType: ClientType = this.clientTypes.find(x => x.id === id);
    return clientType;
  }

  public getBookingTypeById(id:number){
    let bookingType: BookingType = this.types.find(x => x.id === id);
    return bookingType;
  }

  public getTypeIndex(type: ClientType){
    return this.clientTypes.indexOf(type);
  }

  fetchClientTypes() {
    this.fetchedClientTypes = false;
    this.clientTypesService.fetchClientTypes().subscribe(clientTypes =>{
      this.fetchedClientTypes = true;
      this.clientTypes = [];
        for (var i = 0, len = clientTypes.length; i < len; i++) {
          this.clientTypes.push(new ClientType(clientTypes[i].id, clientTypes[i].name, clientTypes[i].annualFee, clientTypes[i].monthlyMiles, clientTypes[i].welcomeBonus, clientTypes[i].bonusMiles));
        }
    },
    error =>{
        this.error = "Something went wrong";
    });
  }

  public next(){
    switch(this.currentPage){
      case 1 : this.fetchOutboundFlights(this.insertForm.value.bookingDepartureDate, this.airports[this.insertForm.value.bookingDepartureAirport].id, this.airports[this.insertForm.value.bookingArrivalAirport].id);  
               if(this.insertForm.value.bookingReturn == 'true'){
                this.fetchReturnFlights(this.insertForm.value.bookingArrivalDate, this.airports[this.insertForm.value.bookingArrivalAirport].id, this.airports[this.insertForm.value.bookingDepartureAirport].id);  
               } break;
      case 2 : this.additionalPassengers = []; break; 
    }

    this.currentPage++;
  }

  public previous(){
    this.currentPage--;
  }

  public onCancel(idBooking: number){
    this.bookingsService.deleteBooking(idBooking).subscribe(data =>{
      
    },
    error =>{
        this.error = "Something went wrong";
    });
  }

  public onConfirm(){
    
    this.success = "Added a new Booking!";
    this.error = "";
    this.insertForm.reset();
    this.currentPage = 1;
  }

}
