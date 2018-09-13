import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormController } from '../../core/FormController';
import alertify from 'alertifyjs';
import { OidcService } from '../../core/oidc.service';

@Component({
  selector: 'email-form-component',
  templateUrl: 'email-form-component.html'
})
export class EmailFormComponent extends FormController implements OnInit {
  private id: string;
  constructor(
    public userService: UserService,
    private oidc: OidcService
  ) {
    super({ service: userService });
    this.oidc.onAuthenticationChange = (auth) => {
      if (auth) {
        this.userService.getByUserName(auth.Value).then(oResponse => {
          this.userService.LoggedUser = oResponse.Result;
          this.id = this.userService.LoggedUser.UserKey;
          this.ngOnInit();
        });
      } else {
        this.userService.LoggedUser = {};
      }
    }
  }

  ngOnInit() {
    if (this.id) {
      this.load(this.id);
    }
  }

  close() {
  }

  testEmail() {
    this.userService.SendTestEmail(this.baseEntity).then(r =>
      alertify.success('EMAIL SENT')
    );
  }


  afterCreate() {
  }

  afterLoad() {
  }

  beforeSave() {

  }

  afterSave() {
  }

  afterRemove() {
  }
}
