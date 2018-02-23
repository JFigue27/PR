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
  errorMessage: string;
  users=[];

  constructor (
                @Inject(MAT_DIALOG_DATA) public data: any,
                public userService: UserServiceProvider,
                public departmentService: DepartmentServiceProvider
              ) {
                super({ service: departmentService });
              }

  ngOnInit() {
    this.load(this.data.oEntityOrId);

    this.userService.getPage(0,1,'?Role=DepartmentManager').subscribe(oResult => {
      console.log('2018');
      console.log(oResult.Result);
      this.users = oResult.Result;
    });
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
