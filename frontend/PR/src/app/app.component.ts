import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
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

    this.oidc.onAuthenticationChange = (auth) => {
      if (auth) {
        this.userService.getByUserName(auth.Value).then(oResponse => {
          this.userService.LoggedUser = oResponse.Result;
        });
      } else {
        this.userService.LoggedUser = {};
      }
    }

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
    if (this.userService.LoggedUser) return this.userService.LoggedUser.Value;
    return '';
  }

  getUserRole() {
    if (this.userService.LoggedUser) return this.userService.LoggedUser.Role;
    return '';
  }

}

