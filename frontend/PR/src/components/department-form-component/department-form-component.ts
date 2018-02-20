import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { FormController } from '../../services/FormController';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'department-form-component',
  templateUrl: 'department-form-component.html'
})
export class DepartmentFormComponent extends FormController implements OnInit {
  errorMessage: string;

  users = [
    { value: 'User', viewValue: 'User' },
    { value: 'Department Manager', viewValue: 'Department Manager' },
    { value: 'General Manager', viewValue: 'General Manager' },
    { value: 'MRO', viewValue: 'MRO' }
  ];

  constructor (
                @Inject(MAT_DIALOG_DATA) public data: any,
                public departmentService: DepartmentServiceProvider
              ) {
                super({ service: departmentService });
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

  afterSave() {
  }

  afterRemove() {
  }
}
