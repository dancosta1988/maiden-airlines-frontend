import { Component, OnInit } from '@angular/core';
import { ClientTypesService } from '../client-types/client-types.service';
import { ClientType } from '../client-types/client-type.model';
import { ConstantsService } from '../common/services/constants.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {

  
  //public clientTypes: clientType[] = [];
  public isFetching = false;
  public error = "";
  public success = "";
  
  public clientTypes: ClientType[] = [ ];

   
  constructor(private clientTypesService: ClientTypesService, private constants: ConstantsService) {}

  ngOnInit() {
    this.fetchclientTypes();
  }

  onFetchclientTypes(){
    this.fetchclientTypes();
  }

  private fetchclientTypes(){
    this.isFetching = true;
    this.clientTypesService.fetchClientTypes().subscribe(clientTypes =>{
      this.isFetching = false;
      this.clientTypes = [];
        for (var i = 0, len = clientTypes.length; i < len; i++) {
          if( clientTypes[i].name != "NOCLIENT")
            this.clientTypes.push(new ClientType(clientTypes[i].id, clientTypes[i].name, clientTypes[i].annualFee, clientTypes[i].monthlyMiles, clientTypes[i].welcomeBonus, clientTypes[i].bonusMiles));
        }
    },
    error =>{
        this.error = "Something went wrong";
    });
    
  }

  onErrorClose(){
    this.error = null;
  }

  onSuccessClose(){
    this.success = null;
  }


}
