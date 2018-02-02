import { Component, OnInit } from '@angular/core';
import { DepartmentServiceProvider } from '../../providers/department-service';
import { ModalController } from 'ionic-angular';
import { ListController } from '../../services/ListController';
import { DepartmentFormComponent } from '../department-form-component/department-form-component';

@Component({
  selector: 'department-component',
  templateUrl: 'department-component.html'
})
export class DepartmentComponent extends ListController implements OnInit  {
  constructor(public departmentSerivceProvider: DepartmentServiceProvider, public modal: ModalController) {
    super({ service: departmentSerivceProvider });
  }

  ngOnInit() {
    this.load();
  }

  addItem() {
    let profileModal = this.modal.create(DepartmentFormComponent, { oEntityOrId: null });
    profileModal.dismiss(false);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      this.load();
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let profileModal = this.modal.create(DepartmentFormComponent, { oEntityOrId: oEntity.id });
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