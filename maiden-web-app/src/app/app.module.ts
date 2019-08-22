import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { AirplanesComponent } from './airplanes/airplanes.component';
import { AirportsComponent } from './airports/airports.component';
import { HttpClientModule } from '@angular/common/http';
import { FlightsComponent } from './flights/flights.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AirplanesComponent,
    AirportsComponent,
    FlightsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent,MenuComponent]
})
export class AppModule { }
