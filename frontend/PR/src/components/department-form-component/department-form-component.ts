import { Component, OnInit } from '@angular/core';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { FormController } from '../../services/FormController';
import { NavParams, NavController } from 'ionic-angular';

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

  constructor(public departmentSerivceProvider: DepartmentServiceProvider, private params: NavParams, private nav: NavController) {
    super({ service: departmentSerivceProvider });
  }

  ngOnInit() {
    this.load(this.params.get('oEntityOrId'));
  }

  close() {
    this.nav.pop();
  }

  afterCreate() {
  }

  afterLoad() {
  }

  afterSave() {
    this.nav.pop();
  }

  afterRemove() {
  }
}
