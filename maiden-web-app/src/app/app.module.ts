import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { AirplanesComponent } from './airplanes/airplanes.component';
import { AirportsComponent } from './airports/airports.component';
import { AirportComponent } from './airports/airport/airport.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AirplanesComponent,
    AirportsComponent,
    AirportComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent,MenuComponent]
})
export class AppModule { }
