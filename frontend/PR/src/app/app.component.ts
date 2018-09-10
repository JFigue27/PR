import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { LoginComponent } from '../components/login/login';
import { UserService } from '../services/user.service';
import { FormControl } from '@angular/forms';
import { OidcService } from '../core/oidc.service';

@Component({
  templateUrl: 'app-component.html'
})
export class MyApp {
  CurrentUser: string;
  mode = new FormControl('over');

  constructor ( public modal: ModalController, public userService: UserService, private oidc:OidcService ) {
          this.initializeApp();
      }

  initializeApp() {
    this.oidc.getUser().then(response => {
      console.log(response);

       if (!response) {
         this.oidc.login();
        // this.oidc.login();
       }
    });

    // let user = JSON.parse(localStorage.getItem('user')) || {};
    this.userService.LoggedUser = {UserName: 'apacheco', 'Roles': 'Administrator'};
    // if (!user.access_token) {
    //   let profileModal = this.modal.create(LoginComponent, null, { enableBackdropDismiss: true });
    //   profileModal.dismiss(false);
    //   profileModal.present();
    //   this.CurrentUser = user.DisplayName;
    // }
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

