import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { FormController } from '../../services/FormController';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UserServiceProvider } from '../../providers/user-service';

@Component({
  selector: 'department-form-component',
  templateUrl: 'department-form-component.html'
})
export class DepartmentFormComponent extends FormController implements OnInit {
  private users=[];

  constructor (
                @Inject(MAT_DIALOG_DATA) public data: any,
                public userService: UserServiceProvider,
                public departmentService: DepartmentServiceProvider
              ) {
                super({ service: departmentService });
              }

  ngOnInit() {
    this.load(this.data.oEntityOrId);

    this.userService.getPage(0,1,'?Role=Department Manager,General Manager').subscribe(oResult => {
      this.users = oResult.Result;
    });
  }

  close() {
  }

  afterCreate() {
  }

  afterLoad() {
  }

  beforeSave() {

  }
  
  afterSave() {
    this.load(this.data.oEntityOrId);
  }

  afterRemove() {
  }
}
