import { Component, OnInit } from '@angular/core';
import { Airport } from './airport.model';

@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html',
  styleUrls: ['./airports.component.css']
})
export class AirportsComponent implements OnInit {
  public airports: Airport[] = [
    new Airport(1, "Aiport 1", "A1", "Lisbon", "Portugal"),
    new Airport(2, "Aiport 2", "A2", "Lisbon", "Portugal"),
    new Airport(3, "Aiport 3", "A3", "Oporto", "Portugal"),
    new Airport(4, "Aiport 4", "A4", "Madrid", "Spain")
  ]

  constructor() { }

  ngOnInit() {
  }

}
