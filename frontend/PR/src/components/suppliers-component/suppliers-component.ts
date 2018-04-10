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
    super({ service: supplierService, paginate: true, limit: 10, filterName: 'SupplierFilter' });
            }

  ngOnInit() {
    this.load();
  }

  addItem() {
    let dialog = this.dialog.open(SupplierFormComponent, {
      data: { oEntityOrId: null }
    });

    dialog.afterClosed().subscribe(result => {
      this.load();
    });

  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let dialog = this.dialog.open(SupplierFormComponent, {
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
