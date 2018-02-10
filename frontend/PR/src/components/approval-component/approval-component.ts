import { Component, OnInit } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { ModalController } from 'ionic-angular'; 
import { ListController } from '../../services/ListController';
import { FormComponent } from '../form-component/form-component';

@Component({
  selector: 'approval-component',
  templateUrl: 'approval-component.html'
})
export class ApprovalComponent extends ListController implements OnInit {
  constructor(public approvalSerivceProvider: ApprovalServiceProvider, public modal: ModalController) {
    super({ service: approvalSerivceProvider });
  }

  ngOnInit() {
    this.load();
  }
 

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let profileModal = this.modal.create(FormComponent, { oEntityOrId: oEntity.id });
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