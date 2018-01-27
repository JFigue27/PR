import { Component, OnInit } from '@angular/core';
import { SupplierServiceProvider } from '../../providers/supplier-service';
import { ModalController } from 'ionic-angular';
import { ListController } from '../../services/ListController';
import { SupplierFormComponent } from '../supplier-form-component/supplier-form-component';

@Component({
  selector: 'suppliers-component',
  templateUrl: 'suppliers-component.html'
})
export class SuppliersComponent extends ListController implements OnInit {

  constructor(public supplierSerivceProvider: SupplierServiceProvider, public modal: ModalController) {
    super({ service: supplierSerivceProvider });
  }

  ngOnInit() {
    this.load();
 }

  addsupplier() {
    let profileModal = this.modal.create(SupplierFormComponent, {oEntityOrId: null});
    profileModal.dismiss(false);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      this.load();
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let profileModal = this.modal.create(SupplierFormComponent, { oEntityOrId: oEntity.id });
    profileModal.dismiss(false);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      this.load();
    });
  }
  
  afterRemove() {
    this.load();
  }
  
  afterCreate() {
  }

}
