import { Component, OnInit, Inject } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-operator-view',
  templateUrl: './operator-view.component.html',
  styleUrls: ['./operator-view.component.css']
})
export class OperatorViewComponent implements OnInit {

  public showView = "";
  public role = "";

  constructor() { 
    
  }

  ngOnInit() {
    
    if(localStorage.getItem('role')){ 
      this.role = localStorage.getItem('role');
      
      switch(this.role){
        case "Administrator": this.setView('flights');break;
        case "Manager_Operator": this.setView('flights');break;
        case "Client_Manager": this.setView('clients');break;
      }
    }
    
  }

  public setView(view: string){
    this.showView = view;
  }



}
