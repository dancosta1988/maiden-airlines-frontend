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
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoginBarComponent } from './login-bar/login-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AirplanesComponent,
    AirportsComponent,
    FlightsComponent,
    OperatorViewComponent,
    FooterComponent,
    HeaderComponent,
    LoginBarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ConstantsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
