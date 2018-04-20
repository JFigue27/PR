import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginComponent } from '../components/login/login';
import { ListPage } from '../pages/list-page/list-page';
import { UserServiceProvider } from '../providers/user-service';
import { UsersPage } from '../pages/users/users-page';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  CurrentUser: string;
  @ViewChild(Nav) nav: Nav;
  rootPage: any = UsersPage;

  constructor ( public platform: Platform, public modal: ModalController, public userService: UserServiceProvider ) {
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
 
}

