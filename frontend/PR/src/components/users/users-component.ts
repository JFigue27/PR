import { Component, OnInit } from '@angular/core';
import { UserServiceProvider } from '../../providers/user-service';
import { ModalController } from 'ionic-angular';
import { UserFormComponent } from '../user-form/user-form-component';
import { ListController } from '../../services/ListController';

@Component({
  selector: 'users-component',
  templateUrl: 'users-component.html'
})
export class UsersComponent extends ListController implements OnInit {

  constructor(public userSerivceProvider: UserServiceProvider, public modal: ModalController) {
    super({ service: userSerivceProvider });
  }

  ngOnInit() {
    this.load();
 }

  addUser() {
    let profileModal = this.modal.create(UserFormComponent, {oEntityOrId: null});
    profileModal.dismiss(false);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      this.load();
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let profileModal = this.modal.create(UserFormComponent, { oEntityOrId: oEntity.id });
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
