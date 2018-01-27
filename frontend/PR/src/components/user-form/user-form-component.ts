import { Component, OnInit } from '@angular/core';
import { UserServiceProvider } from '../../providers/user-service';
import { FormController } from '../../services/FormController';
import { NavParams, NavController } from 'ionic-angular';

@Component({
  selector: 'user-form-component',
  templateUrl: 'user-form-component.html'
})

export class UserFormComponent extends FormController implements OnInit { 
  errorMessage: string;

  constructor(public userSerivceProvider: UserServiceProvider, private params: NavParams, private nav: NavController) {
    super({ service: userSerivceProvider });
  }

  ngOnInit() {
     this.load(this.params.get('oEntityOrId'));
  }

  close(){
    this.nav.pop();
  }

  afterCreate() {
  }

  afterLoad() {
  }

  afterSave(){
    this.nav.pop();
  }

  afterRemove() {
  }
}
