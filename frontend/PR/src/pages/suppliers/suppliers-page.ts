import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'suppliers-page',
  templateUrl: 'suppliers-page.html',
})

export class SuppliersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}
