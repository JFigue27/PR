import { Component, OnInit, Inject } from '@angular/core';
import { AccountServiceProvider } from '../../providers/account-service';
import { FormController } from '../../services/FormController';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'account-form-component',
  templateUrl: 'account-form-component.html'
})

export class AccountFormComponent extends FormController implements OnInit {
  private departments = [];
  constructor (
            @Inject(MAT_DIALOG_DATA)public data:any,
            public accountService: AccountServiceProvider,
            private department: DepartmentServiceProvider
          ) {
              super({ service: accountService });
          }

  ngOnInit() {
    this.load(this.data.oEntityOrId);
    this.department.loadEntities().subscribe( oResult => {
      this.departments = oResult.Result;
    })
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
  }

  afterRemove() {
  }
}
