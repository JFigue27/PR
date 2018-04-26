import { Component, OnInit } from '@angular/core';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { ListController } from '../../services/ListController';
import { DepartmentFormComponent } from '../department-form/department-form-component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'department-component',
  templateUrl: 'department-component.html'
})
export class DepartmentComponent extends ListController implements OnInit  {

  constructor (
              public departmentSerivceProvider: DepartmentServiceProvider,
              public dialog:MatDialog
            ) {
                super({ service: departmentSerivceProvider, paginate: true, limit: 10, filterName: 'DepartmentFilter' });
              }

  ngOnInit() {
    this.load();
  }

  addItem() {
    let dialog = this.dialog.open(DepartmentFormComponent, { 
        data: { oEntityOrId: null }
    });

    dialog.afterClosed().subscribe(result => {
      this.load();
    });
  }

  afterLoad() {
  }
  
  onOpenItem(oEntity) {
    let dialog = this.dialog.open(DepartmentFormComponent, {
        data: { oEntityOrId: oEntity.id }
    });

    dialog.afterClosed().subscribe(result => {
      this.load();
    });
  } 

  afterRemove() {
    this.load();
  }

  afterCreate() {
  }

}