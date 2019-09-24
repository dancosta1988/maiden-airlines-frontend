import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AirplanesComponent } from './airplanes/airplanes.component';
import { AirportsComponent } from './airports/airports.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlightsComponent } from './flights/flights.component';
import { OperatorViewComponent } from './operator-view/operator-view.component';
import { ConstantsService } from './common/services/constants.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoginBarComponent } from './login-bar/login-bar.component';
import { BackofficeRolesComponent } from './backoffice-roles/backoffice-roles.component';
import { DatePipe } from '@angular/common';
import { BackofficeOperatorsComponent } from './backoffice-operators/backoffice-operators.component';
import { ClientTypesComponent } from './client-types/client-types.component';
import { ClientsComponent } from './clients/clients.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { BookingTypesComponent } from './booking-types/booking-types.component';
import { BackofficeLoginComponent } from './backoffice-login/backoffice-login.component';
import { StorageServiceModule} from 'angular-webstorage-service';
import { ClubComponent } from './club/club.component';
import { BasicAuthHtppInterceptorService } from './common/services/httpinterceptor.service';
import { ClientBookingComponent } from './client-booking/client-booking.component';

@NgModule({
  declarations: [
    AppComponent,
    AirplanesComponent,
    AirportsComponent,
    FlightsComponent,
    OperatorViewComponent,
    FooterComponent,
    HeaderComponent,
    LoginBarComponent,
    BackofficeRolesComponent,
    BackofficeOperatorsComponent,
    ClientTypesComponent,
    ClientsComponent,
    HomeComponent,
    BookingComponent,
    BookingTypesComponent,
    BackofficeLoginComponent,
    ClubComponent,
    ClientBookingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    StorageServiceModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass:BasicAuthHtppInterceptorService , multi: true },
    ConstantsService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
