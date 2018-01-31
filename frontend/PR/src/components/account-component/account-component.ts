import { Component, OnInit } from '@angular/core';
import { AccountServiceProvider } from '../../providers/account-service';
import { ModalController } from 'ionic-angular';
import { AccountFormComponent } from '../account-form-component/account-form-component';
import { ListController } from '../../services/ListController';

@Component({
  selector: 'account-component',
  templateUrl: 'account-component.html'
})
export class AccountComponent extends ListController implements OnInit {
  constructor(public accountSerivceProvider: AccountServiceProvider, public modal: ModalController) {
    super({ service: accountSerivceProvider });
  }

  ngOnInit() {
    this.load();
  }

  addItem() {
    let profileModal = this.modal.create(AccountFormComponent, { oEntityOrId: null });
    profileModal.dismiss(false);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      this.load();
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let profileModal = this.modal.create(AccountFormComponent, { oEntityOrId: oEntity.id });
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