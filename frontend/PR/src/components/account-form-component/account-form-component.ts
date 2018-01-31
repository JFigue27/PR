import { Component, OnInit } from '@angular/core';
import { AccountServiceProvider } from '../../providers/account-service';
import { FormController } from '../../services/FormController';
import { NavParams, NavController } from 'ionic-angular';

@Component({
  selector: 'account-form-component',
  templateUrl: 'account-form-component.html'
})

export class AccountFormComponent extends FormController implements OnInit {
  errorMessage: string;

  constructor(public accountSerivceProvider: AccountServiceProvider, private params: NavParams, private nav: NavController) {
    super({ service: accountSerivceProvider });
  }

  ngOnInit() {
    this.load(this.params.get('oEntityOrId'));
  }

  close() {
    this.nav.pop();
  }

  afterCreate() {
  }

  afterLoad() {
  }

  afterSave() {
    this.nav.pop();
  }

  afterRemove() {
  }
}
