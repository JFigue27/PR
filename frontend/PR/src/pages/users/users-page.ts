import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'users-page',
  templateUrl: 'users-page.html',
})

export class UsersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}
