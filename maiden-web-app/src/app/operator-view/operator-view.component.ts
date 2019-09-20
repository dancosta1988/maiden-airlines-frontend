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

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService) { 
    this.role = this.storage.get('role');
    console.log(this.storage);
    console.log(this.storage.get('name'));
  }

  ngOnInit() {
    this.setView('flights');
    
  }

  public setView(view: string){
    this.showView = view;
  }



}
