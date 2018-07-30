import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { LoginComponent } from '../components/login/login';
import { UserService } from '../services/user.service';
import { FormControl } from '@angular/forms';

@Component({
  templateUrl: 'app-component.html'
})
export class MyApp {
  CurrentUser: string;
  mode = new FormControl('over');

  constructor ( public modal: ModalController, public userService: UserService ) {
          this.initializeApp();
      }

  initializeApp() {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    this.userService.LoggedUser = user;
    if (!user.access_token) {
      let profileModal = this.modal.create(LoginComponent, null, { enableBackdropDismiss: true });
      profileModal.dismiss(false);
      profileModal.present();
      this.CurrentUser = user.DisplayName;
    }
  }
  logout() {
    localStorage.clear();
    let profileModal = this.modal.create(LoginComponent, null, { showBackdrop: true, enableBackdropDismiss: false });
    profileModal.present();
  }

  getUserName() {
    return this.userService.LoggedUser.UserName;
  }

  getUserRole() {
    return this.userService.LoggedUser.Roles;
  }
 
}

