import { Component, OnInit, Inject } from '@angular/core';
import { UserServiceProvider } from '../../providers/user-service';
import { FormController } from '../../services/FormController';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DepartmentServiceProvider } from '../../providers/department-service';

@Component({
  selector: 'user-form-component',
  templateUrl: 'user-form-component.html'
})
export class UserFormComponent extends FormController implements OnInit {
  public departments = [];
  roles = [
    { value: 'Department Manager', viewValue: 'Department Manager' },
    { value: 'Finance', viewValue: 'Finance' },
    { value: 'General Manager', viewValue: 'General Manager'},
    { value: 'MRO', viewValue: 'MRO' },
    { value: 'Purchasing Manager', viewValue: 'Purchasing Manager' },
    { value: 'User', viewValue: 'User' }
  ];
 
  constructor (
                @Inject(MAT_DIALOG_DATA) public data: any,
                public userService: UserServiceProvider,
                public departmentService: DepartmentServiceProvider
              ) {
                  super({ service: userService });
              }

  ngOnInit() {
    this.load(this.data.oEntityOrId);

    this.departmentService.loadEntities().subscribe(oResult => {
      this.departments = oResult.Result;
    });

  }

  afterCreate() {
  }

  afterLoad() {
  }

  beforeSave(){
    
  }

  afterSave(){
  }

  afterRemove() {
  }
}
