import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { NavController } from 'ionic-angular';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})

export class LoginComponent {
  private errorMessage: string;
  constructor(public nav: NavController, private loginService: LoginService, public spinner: NgxSpinnerService) {

  }

  login(formValues) {
    if (!formValues.userName || !formValues.password) {
      this.errorMessage = 'Username or Password fields are missing';
    } else { 
      const data = 'grant_type=password&userName=' + formValues.userName + '&password=' + formValues.password;
      this.spinner.show();
      this.loginService.getToken(data).then(results => {
        this.nav.pop();
        })
        .catch( response => {
          this.errorMessage = response;
          this.spinner.hide();
        })
        .then( response => {
          this.spinner.hide();
        });
        
      }
    }

}
