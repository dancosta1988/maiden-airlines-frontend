import { Component, OnInit } from '@angular/core';
import { ConstantsService } from '../common/services/constants.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private constants: ConstantsService) { }

  ngOnInit() {
  }

}
