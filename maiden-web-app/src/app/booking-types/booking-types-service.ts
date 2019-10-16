import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../common/services/constants.service';
import { Injectable } from '@angular/core';
import { BookingType } from './booking-type.model';

@Injectable({providedIn: 'root'})
export class BookingTypesService {

    constructor(private http: HttpClient, private constants:ConstantsService){}

    createAndStoreBookingType(name: string,
        cancelBooking: boolean,
        changeDate: boolean,
        checkedBaggage: boolean,
        handBaggage: boolean,
        cost: number){
        var cancel = 0, change = 0, checked = 0, hand = 0;
        if(cancelBooking)
            cancel = 1;
        if(changeDate)
            change = 1;
        if(checkedBaggage)
            checked = 1;
        if(handBaggage)
            hand = 1;
        
        
        return this.http.post(this.constants.webServicesUrl+'/BookingTypes/BookingTypeCreate?name='+name+'&handBaggage='+hand+'&checkedBaggage='+checked+'&changeDate='+change+'&cancelBooking='+cancel+'&cost='+cost, null);
    }

    updateBookingType(id: number, name: string,
        cancelBooking: boolean,
        changeDate: boolean,
        checkedBaggage: boolean,
        handBaggage: boolean,
        cost: number){

        var cancel = 0, change = 0, checked = 0, hand = 0;
        if(cancelBooking)
            cancel = 1;
        if(changeDate)
            change = 1;
        if(checkedBaggage)
            checked = 1;
        if(handBaggage)
            hand = 1;
        return this.http.post(this.constants.webServicesUrl+'/BookingTypes/BookingTypeUpdate?name='+name+'&handBaggage='+hand+'&checkedBaggage='+checked+'&changeDate='+change+'&cancelBooking='+cancel+'&cost='+cost, null);
    }

    deleteBookingType(id: number){
        return this.http.post(this.constants.webServicesUrl+'/BookingTypes/BookingTypeDelete?id='+id, null);
    }

    fetchBookingTypes(){
        return this.http.get<BookingType[]>(this.constants.webServicesUrl+'/BookingTypes');
    }
}