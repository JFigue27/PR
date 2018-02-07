import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { FormController } from '../../services/FormController';
import { PRServiceProvider } from '../../providers/pr-service';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { AccountServiceProvider } from '../../providers/account-service';


@Component({
  selector: 'form-component',
  templateUrl: 'form-component.html'
})
export class FormComponent extends FormController implements OnInit {
  accounts = [];
  departments = [];
  currencies = [ 
                  { value: 'Dlls', viewValue: 'Dlls' },
                  { value: 'Mxn', viewValue: 'Mxn' }
              ];

  constructor(
              public listService:PRServiceProvider,
              private params: NavParams,
              private department: DepartmentServiceProvider,
              private account: AccountServiceProvider
            ) {
    super( { service: listService } );
  }

  ngOnInit() {    
    this.load(this.params.get('oEntityOrId'));

    this.department.loadEntities().subscribe(oResult => {
      this.departments = oResult.Result;
    });
    this.account.loadEntities().subscribe(oResult => {
      this.accounts = oResult.Result;
    });
  }

  afterLoad() {
    if (this.baseEntity) {
      this.handleDynamicRows(this.baseEntity.PRLines);
    }
  }
  
  afterCreate() {
    if (this.baseEntity) {
      this.handleDynamicRows(this.baseEntity.PRLines);
    }
  }
  
  afterSave() {
    this.handleDynamicRows(this.baseEntity.PRLines);
  }
  
  afterRemove() {
  }

  handleDynamicRows(arrRows: Array<any>) {
    if ( arrRows.length > 0) {
      let atLeastOneCellFilled = false;
      let lastRow = arrRows[arrRows.length - 1];
      for (let prop in lastRow) {
        if (lastRow.hasOwnProperty(prop)) {
          if (prop == 'id') {
            continue;
          }
          if (lastRow[prop] !== null && lastRow[prop] !== undefined && (lastRow[prop] > 0 || lastRow[prop].length > 0)) {
            atLeastOneCellFilled = true;
            break;
          }
        }
      }
      if (!atLeastOneCellFilled) {
        return;
      }
    }
    arrRows.push({});
  };

  removeItemLocally = function(index) {
    this.baseEntity.PRLines.splice(index, 1);
  }
}
