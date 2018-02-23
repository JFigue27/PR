import { Component, OnInit } from '@angular/core';
import { SupplierServiceProvider } from '../../providers/supplier-service';
import { ListController } from '../../services/ListController';
import { SupplierFormComponent } from '../supplier-form-component/supplier-form-component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'suppliers-component',
  templateUrl: 'suppliers-component.html'
})
export class SuppliersComponent extends ListController implements OnInit {
  constructor (
              public dialog:MatDialog,
              public supplierService: SupplierServiceProvider,
            ) {
                super({ service: supplierService });
            }

  ngOnInit() {
    this.load();
  }

  addItem() {
    this.dialog.open(SupplierFormComponent, {
      data: { oEntityOrId: null }
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    this.dialog.open(SupplierFormComponent, {
      data: { oEntityOrId: oEntity.id }
    });
  }
  
  afterRemove() {
    this.load();
  }
  
  afterCreate() {
  }

}
