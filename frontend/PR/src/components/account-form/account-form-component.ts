import { Component, OnInit, Inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormController } from '../../core/FormController';
import { DepartmentService } from '../../services/department.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'account-form-component',
  templateUrl: 'account-form-component.html'
})

export class AccountFormComponent extends FormController implements OnInit {
  private departments = [];
  constructor (
            @Inject(MAT_DIALOG_DATA)public data:any,
            public accountService: AccountService,
            private department: DepartmentService
          ) {
              super({ service: accountService });
          }

  ngOnInit() {
    this.load(this.data.oEntityOrId);
    this.department.loadEntities().then( oResult => {
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
