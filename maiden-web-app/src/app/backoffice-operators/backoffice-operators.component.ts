import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Role } from '../backoffice-roles/role.model';
import { RolesService } from '../backoffice-roles/backoffice-roles.service';
import { Operator } from './backoffice-operator.model';
import { OperatorsService } from './backoffice-operators.service';

@Component({
  selector: 'app-backoffice-operators',
  templateUrl: './backoffice-operators.component.html',
  styleUrls: ['./backoffice-operators.component.css']
})
export class BackofficeOperatorsComponent implements OnInit {

  insertForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;

  //public employees: employee[] = [];
  public isFetching = false;
  public fetchedRoles = false;
  public error = "";
  public success = "";
  public role = "";
  
  public employees: Operator[] = [ ];
  public roles: Role[] = [ ];

   
  constructor(private rolesService: RolesService, private employeesService: OperatorsService) {}

  ngOnInit() {

    this.role = localStorage.getItem('role');
    this.onRefresh();

    //using Reactive Forms
    this.insertForm = new FormGroup({
      'employeeName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'employeeRole' : new FormControl(null,Validators.required),
      'employeeUserName' : new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'employeePassword' : new FormControl(null,Validators.required)
    });

    this.editForm = new FormGroup({
      'employeeId' : new FormControl(null),
      'employeeName' : new FormControl(null,[Validators.required, Validators.pattern("^[A-ZÀ-Ù][a-zà-ú]*$")]),
      'employeeRole' : new FormControl(null,Validators.required),
      'employeeUserName' : new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-ZÀ-ú0-9_.+-ªº ]*[a-zA-ZÀ-ú0-9-.ºª ]+$")]),
      'employeePassword' : new FormControl(null,Validators.required)
    });
    
    this.deleteForm = new FormGroup({
      'employeeId' : new FormControl(null),
    });

  }
  
  onRefresh() {
    this.fetchroles();
    this.fetchemployees();
  }

  populateEditForm(index: number){    
    
        this.editForm.setValue({
          employeeId: index,
          employeeName: this.employees[index].name,
          employeeRole: this.getRoleIndex(this.employees[index].role),
          employeeUserName: this.employees[index].userName,
          employeePassword: this.employees[index].password
        });

  }

  populateDeleteForm(index: number){
    this.deleteForm.setValue({
      employeeId : index
    });
  }

  onCreateEmployee(){
    //send http request
    this.employeesService.createAndStoreOperator(
      this.insertForm.value.employeeName,
      this.roles[this.insertForm.value.employeeRole].id,
      this.insertForm.value.employeeUserName,
      this.insertForm.value.employeePassword
      ).subscribe(responseData => {
        if(responseData === -1){
          this.success = "";
          this.error = "Something went wrong when inserting a employee..."
        }else{
          this.error = "";
          this.success = "Employee inserted!";
          this.fetchemployees();
        }
        
      },
      error =>{
          this.error = "";
          this.error = "Something went wrong";
      });
  }

  
  onUpdateEmployee(){
    //send http request
    this.employeesService.updateOperator(
      this.employees[this.editForm.value.employeeId].id,
      this.editForm.value.employeeName,
      this.roles[this.editForm.value.employeeRole].id,
      this.editForm.value.employeeUserName,
      this.editForm.value.employeePassword
      ).subscribe(responseData => {
        this.error = "";
        this.success = "Employee updated!";
        this.fetchemployees();
      },
      error =>{
          this.success = "";
          this.error = "Something went wrong";
      });
  }

  onDeleteEmployee(){
    //get id from the deleteForm
    let index = this.deleteForm.value.employeeId;
  
    //send http request
    this.employeesService.deleteOperator(this.employees[index].id).subscribe(responseData => {
      this.error = "";
      this.success = "Employee Deleted!";
      this.fetchemployees();
    },
    error =>{
        this.success = "";
        this.error = "Something went wrong";
    });

  }

  onFetchemployees(){
    this.fetchemployees();
  }

  private fetchemployees(){
    this.isFetching = true;
    this.employeesService.fetchOperators().subscribe(employees =>{
      this.isFetching = false;
      this.employees = [];
      for (var i = 0, len = employees.length; i < len; i++) {
        this.employees.push(new Operator(employees[i].id, employees[i].name, this.getRoleById(employees[i].idRole), employees[i].username, employees[i].password));
      }
      this.error ="";
      this.success = "";
    },
    error =>{
        this.success = "";
        this.error = "Something went wrong";
    });
    
  }

  private fetchroles(){
    this.fetchedRoles = false;
    this.rolesService.fetchRoles().subscribe(roles =>{
      this.roles = [];
      for (var i = 0, len = roles.length; i < len; i++) {
        this.roles.push(new Role(roles[i].id, roles[i].name));
      }
      this.fetchedRoles = true;
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

  public getRoleIndex(role: Role){
    return this.roles.indexOf(role);
  }

  public getRoleById(id:number){
    let role: Role = this.roles.find(x => x.id === id);
    return role;
  }

}
