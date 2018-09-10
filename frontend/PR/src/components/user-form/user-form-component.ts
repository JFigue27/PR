import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormController } from '../../core/FormController';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DepartmentService } from '../../services/department.service';

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
    { value: 'Project Manager', viewValue: 'Project Manager' },
    { value: 'User', viewValue: 'User' }
  ];
 
  constructor (
                @Inject(MAT_DIALOG_DATA) public data: any,
                public userService: UserService,
                public departmentService: DepartmentService
              ) {
                  super({ service: userService });
              }

  ngOnInit() {
    this.load(this.data.oEntityOrId);

    this.departmentService.loadEntities().then(oResult => {
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
