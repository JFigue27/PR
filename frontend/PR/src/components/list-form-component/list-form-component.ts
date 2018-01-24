import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ListController } from '../../services/ListController';
import { FormController } from '../../services/FormController';
import { PRServiceProvider } from '../../providers/pr-service';

@Component({
  selector: 'list-form-component',
  templateUrl: 'list-form-component.html'
})
export class ListFormComponent extends FormController implements OnInit {

  constructor( public listService:PRServiceProvider, private params: NavParams ) {
    super( { service: listService } );
  }

  ngOnInit(){
      this.load(this.params.get('oEntityOrId'));
  }

  afterLoad() {
    if (this.baseEntity) {
      this.handleDynamicRows(this.baseEntity.PRLines);
    }
  }
  
  afterCreate() {
  }
  
  afterSave() {
  }
  
  afterRemove() {
  }

  handleDynamicRows(arrRows: Array<any>) {
    if (arrRows.length > 0) {
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
    this.baseList.splice(index, 1);
  }
}
