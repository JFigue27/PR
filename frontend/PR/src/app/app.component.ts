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

  constructor(public modal: ModalController, public userService: UserService, private oidc: OidcService) {
    this.oidc.getUser()
      .then(response => {
        console.log(response);

        if (!response) {
          this.oidc.login();
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

  logout() {
    this.oidc.logout();
  }

  getUserName() {
    return this.oidc.authentication.Value;
  }

  getUserRole() {
    console.log(this.oidc.authentication);
    // return this.userService.LoggedUser.Roles;
  }

}

