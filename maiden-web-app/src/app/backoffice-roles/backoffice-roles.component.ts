import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Role } from './role.model';
import { RolesService } from './backoffice-roles.service';

@Component({
  selector: 'app-backoffice-roles',
  templateUrl: './backoffice-roles.component.html',
  styleUrls: ['./backoffice-roles.component.css']
})

export class BackofficeRolesComponent implements OnInit {

  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;

  //public roles: role[] = [];
  public isFetching = false;
  public error = "";
  public success = "";
  public role = "";
  public roles: Role[] = [ ];

   
  constructor(private rolesService: RolesService) {}

  ngOnInit() {

    this.role = localStorage.getItem('role');
    this.fetchroles();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'roleName' : new FormControl(null,Validators.required)
    });

    this.editForm = new FormGroup({
      'roleId' : new FormControl(null),
      'roleName' : new FormControl(null,Validators.required)
    });
    
    this.deleteForm = new FormGroup({
      'roleId' : new FormControl(null),
    });

  }

  populateEditForm(index: number){
    
        this.editForm.setValue({
          roleId: this.roles[index].id,
          roleName: this.roles[index].name,
        });

  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      roleId : index
    });
  }

  onCreateRole(){
    //send http request
    this.rolesService.createAndStoreRole(
      this.insertForm.value.roleName
      ).subscribe(responseData => {
        this.error = "";
        this.success = "Role inserted!";
        this.fetchroles();
      },
      error =>{
          this.success = "";
          this.error = "Something went wrong";
      });
  }

  
  onUpdateRole(){
    //send http request
    this.rolesService.updateRole(
      this.editForm.value.roleId,
      this.editForm.value.roleName, 
      ).subscribe(responseData => {
        this.error  = "";
        this.success = "Role updated!";
        this.fetchroles();
      },
      error =>{
          this.success = "";
          this.error = "Something went wrong";
      });
  }

  onDeleteRole(){
    
    //get id from the deleteForm
    let index = this.deleteForm.value.roleId;
    
    //send http request
    this.rolesService.deleteRole(this.roles[index].id).subscribe(responseData => {
      this.error = "";
      this.success = "Role Deleted!";
      this.fetchroles();
    },
    error =>{
        this.success = "";
        this.error = "Something went wrong";
    });

  }

  onFetchroles(){
    this.fetchroles();
  }

  private fetchroles(){
    this.isFetching = true;
    this.rolesService.fetchRoles().subscribe(roles =>{
      this.isFetching = false;
      this.roles = [];
      for (var i = 0, len = roles.length; i < len; i++) {
        this.roles.push(new Role(roles[i].id, roles[i].name));
      }
      this.success ="";
      this.error = "";
    },
    error =>{
        this.success = "";
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
