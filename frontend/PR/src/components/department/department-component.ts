import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { ListController } from '../../core/ListController';
import { DepartmentFormComponent } from '../department-form/department-form-component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'department-component',
  templateUrl: 'department-component.html'
})
export class DepartmentComponent extends ListController implements OnInit  {

  constructor (
              public departmentSerivceProvider: DepartmentService,
              public dialog:MatDialog
            ) {
                super({ service: departmentSerivceProvider, paginate: true, limit: 20, filterName: 'DepartmentFilter' });
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