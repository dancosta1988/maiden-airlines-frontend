import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { AirplanesComponent } from './airplanes/airplanes.component';
import { AirportsComponent } from './airports/airports.component';
import { HttpClientModule } from '@angular/common/http';
import { FlightsComponent } from './flights/flights.component';
import { OperatorViewComponent } from './operator-view/operator-view.component';
import { ConstantsService } from './common/services/constants.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AirplanesComponent,
    AirportsComponent,
    FlightsComponent,
    OperatorViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ConstantsService],
  bootstrap: [AppComponent,MenuComponent]
})
export class AppModule { }
