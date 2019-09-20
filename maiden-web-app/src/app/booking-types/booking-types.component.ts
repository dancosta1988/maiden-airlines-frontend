import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookingTypesService } from './booking-types-service';
import { BookingType } from './booking-type.model';

@Component({
  selector: 'app-booking-types',
  templateUrl: './booking-types.component.html',
  styleUrls: ['./booking-types.component.css']
})
export class BookingTypesComponent implements OnInit {

  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;

  //public bookingTypes: bookingType[] = [];
  public isFetching = false;
  public error = "";
  public success = "";
  public role = "";
  public bookingTypes: BookingType[] = [ ];

  public editBookingTypeCancel : string = "false";
  public editBookingTypeChangeDate : string = "false";
  public editBookingTypeHandBaggage : string = "false";
  public editBookingTypeCheckedbaggage : string = "false";

   
  constructor(private bookingTypesService: BookingTypesService) {}

  ngOnInit() {

    this.role = localStorage.getItem('role');
    this.fetchbookingTypes();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'bookingTypeName' : new FormControl(null,Validators.required),
      'bookingTypeCancel' : new FormControl(null,Validators.required),
      'bookingTypeCheckedBaggage' : new FormControl(null,Validators.required),
      'bookingTypeHandBaggage' : new FormControl(null,Validators.required),
      'bookingTypeChangeDate' : new FormControl(null,Validators.required),
      'bookingTypeCost' : new FormControl(null,Validators.required)
    });

    this.editForm = new FormGroup({
      'bookingTypeId' : new FormControl(null),
      'bookingTypeName' : new FormControl(null,Validators.required),
      'bookingTypeCancel' : new FormControl(null,Validators.required),
      'bookingTypeCheckedBaggage' : new FormControl(null,Validators.required),
      'bookingTypeHandBaggage' : new FormControl(null,Validators.required),
      'bookingTypeChangeDate' : new FormControl(null,Validators.required),
      'bookingTypeCost' : new FormControl(null,Validators.required)
    });
    
    this.deleteForm = new FormGroup({
      'bookingTypeId' : new FormControl(null),
    });

  }

  populateEditForm(index: number){
    console.log("editing bookingType id " + this.bookingTypes[index].id);
    
    this.editForm.setValue({
      bookingTypeId : index,
      bookingTypeName : this.bookingTypes[index].name,
      bookingTypeCost : this.bookingTypes[index].cost,
      bookingTypeCancel : this.bookingTypes[index].cancelBooking,
      bookingTypeChangeDate : this.bookingTypes[index].changeDate,
      bookingTypeCheckedBaggage : this.bookingTypes[index].checkedBaggage,
      bookingTypeHandBaggage : this.bookingTypes[index].handBaggage
    });

    this.editBookingTypeCancel = this.bookingTypes[index].cancelBooking;
    this.editBookingTypeChangeDate = this.bookingTypes[index].changeDate;
    this.editBookingTypeHandBaggage = this.bookingTypes[index].handBaggage;
    this.editBookingTypeCheckedbaggage = this.bookingTypes[index].checkedBaggage;

    console.log("cancel " + this.bookingTypes[index].cancelBooking + " " + this.editForm.value.bookingTypeCancel);
    console.log("checked " + this.bookingTypes[index].checkedBaggage + " " + this.editForm.value.bookingTypeCheckedBaggage);
    console.log("hand " + this.bookingTypes[index].handBaggage + " " + this.editForm.value.bookingTypeHandBaggage);
    console.log("changedate " + this.bookingTypes[index].changeDate + " " + this.editForm.value.bookingTypeChangeDate);
    
  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      bookingTypeId : index
    });
  }

  onCreateBookingType(){
    console.log("onCreateBookingType");
    //send http request
    this.bookingTypesService.createAndStoreBookingType(
      this.insertForm.value.bookingTypeName,
      this.insertForm.value.bookingTypeCancel,
      this.insertForm.value.bookingTypeChangeDate,
      this.insertForm.value.bookingTypeCheckedBaggage,
      this.insertForm.value.bookingTypeHandBaggage,
      this.insertForm.value.bookingTypeCost
      
      ).subscribe(responseData => {
        console.log(responseData);
        if(responseData){
          this.error = "Something went wrong inserting a new booking type..."
        }else{
          this.success = "Booking Type inserted!";
          this.fetchbookingTypes();
        }
      },
      error =>{
          this.error = error.message;
      });
  }

  
  onUpdateBookingType(){
    console.log("onUpdateBookingType");
    //send http request
    this.bookingTypesService.updateBookingType(
      this.bookingTypes[this.editForm.value.bookingTypeId].id,
      this.editForm.value.bookingTypeName,
      this.editForm.value.bookingTypeCancel,
      this.editForm.value.bookingTypeChangeDate,
      this.editForm.value.bookingTypeCheckedBaggage,
      this.editForm.value.bookingTypeHandBaggage,
      this.editForm.value.bookingTypeCost
      ).subscribe(responseData => {
        console.log(responseData);
        this.success = "Booking Type updated!";
        this.fetchbookingTypes();
      },
      error =>{
          this.error = error.message;
      });
  }

  onDeleteBookingType(){
    console.log("onDeleteBookingType");
    //get id from the deleteForm
    let index = this.deleteForm.value.bookingTypeId;
    console.log("deleting bookingType id: " + this.bookingTypes[index].id);
    //send http request
    this.bookingTypesService.deleteBookingType(this.bookingTypes[index].id).subscribe(responseData => {
      console.log(responseData);
      this.success = "BookingType Deleted!";
      this.fetchbookingTypes();
    },
    error =>{
        this.error = error.message;
    });

  }

  onFetchbookingTypes(){
    this.fetchbookingTypes();
  }

  private fetchbookingTypes(){
    this.isFetching = true;
    this.bookingTypesService.fetchBookingTypes().subscribe(bookingTypes =>{
      this.isFetching = false;
      this.bookingTypes = [];
      this.bookingTypes = bookingTypes;
      /*
        for (var i = 0, len = bookingTypes.length; i < len; i++) {
          this.bookingTypes.push(new BookingType( bookingTypes[i].id, bookingTypes[i].name, bookingTypes[i].cancelBooking, bookingTypes[i].changeDate, bookingTypes[i].checkedBaggage, bookingTypes[i].handBaggage, bookingTypes[i].cost ));
        }*/
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
