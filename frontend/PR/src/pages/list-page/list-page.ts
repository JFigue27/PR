import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import { UsersPage } from '../users/users-page';
import { SuppliersPage } from '../suppliers/suppliers-page';

@Component({
  selector: 'list-page',
  templateUrl: 'list-page.html',
})
export class ListPage {

  constructor(public navCtrl: NavController, public nav: NavController) {
  }

  OpenUser(){
    this.nav.push(UsersPage);
  }
  OpenSupplier() {
    this.nav.push(SuppliersPage);
  }
}
