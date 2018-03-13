import { Component, OnInit, Inject } from '@angular/core';
import { UserServiceProvider } from '../../providers/user-service';
import { FormController } from '../../services/FormController';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'user-form-component',
  templateUrl: 'user-form-component.html'
})
export class UserFormComponent extends FormController implements OnInit { 
  roles = [
    { value: 'User', viewValue: 'User' },
    { value: 'DepartmentManager', viewValue: 'Department Manager' },
    { value: 'GeneralManager', viewValue: 'General Manager'},
    { value: 'MRO', viewValue: 'MRO' }
  ];
 
  constructor (
                @Inject(MAT_DIALOG_DATA) public data: any,
                public userService: UserServiceProvider
              ) {
                  super({ service: userService });
              }

  ngOnInit() {
    this.load(this.data.oEntityOrId);
  }

  close() {
  }

  afterCreate() {
  }

  afterLoad() {
  }

  afterSave(){
  }

  afterRemove() {
  }
}
