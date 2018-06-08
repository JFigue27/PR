import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { LoginComponent } from '../components/login/login';
import { HomePage } from '../pages/home/home-page';
import { UserService } from '../services/user.service';
import { ListPage } from '../pages/list-page/list-page';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  CurrentUser: string;
  @ViewChild(Nav) nav: Nav;
  // rootPage: any = HomePage;
  rootPage: any = ListPage;

  constructor ( public platform: Platform, public modal: ModalController, public userService: UserService ) {
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

