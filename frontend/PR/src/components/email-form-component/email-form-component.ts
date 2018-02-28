import { Component, OnInit } from '@angular/core';
import { UserServiceProvider } from '../../providers/user-service';
import { FormController } from '../../services/FormController';

@Component({
  selector: 'email-form-component',
  templateUrl: 'email-form-component.html'
})
export class EmailFormComponent extends FormController implements OnInit {
  id: string;
  constructor (
                public userService: UserServiceProvider
              ) {
              super({ service: userService });
              this.id = this.userService.LoggedUser.UserKey;
          }

  ngOnInit() {
    this.load(this.id);
  }

  close() {
  }

  afterCreate() {
  }

  afterLoad() {
  }

  afterSave() {
  }

  afterRemove() {
  }
}
