import { Component, OnInit } from '@angular/core';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { ListController } from '../../services/ListController';
import { DepartmentFormComponent } from '../department-form-component/department-form-component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'department-component',
  templateUrl: 'department-component.html'
})
export class DepartmentComponent extends ListController implements OnInit  {

  constructor(
              public departmentSerivceProvider: DepartmentServiceProvider,
              public dialog:MatDialog
            ) {
                super({ service: departmentSerivceProvider });
              }

  ngOnInit() {
    this.load();
  }

  addItem() {
   const dialog = this.dialog.open(DepartmentFormComponent, {
      data: { oEntityOrId: null }
    });

    dialog.afterClosed().subscribe(result => {
      console.log('2018');
    })
  }

  afterLoad() {
  }


 onOpenItem(oEntity) {
  this.dialog.open(DepartmentFormComponent, {
      data: { oEntityOrId: oEntity.id }
  });
  } 

afterRemove() {
  this.load();
}

afterCreate() {
}

}