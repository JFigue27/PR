import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormController } from '../../core/FormController';
import alertify from 'alertifyjs';

@Component({
  selector: 'email-form-component',
  templateUrl: 'email-form-component.html'
})
export class EmailFormComponent extends FormController implements OnInit {
  private id: string;
  constructor (
                public userService: UserService
              ) {
              super({ service: userService });
              this.id = this.userService.LoggedUser.UserKey;
          }

  ngOnInit() {
    this.load(this.id);
  }

  close() {
  }

  testEmail() {
    this.userService.SendTestEmail(this.baseEntity).subscribe( r => 
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
