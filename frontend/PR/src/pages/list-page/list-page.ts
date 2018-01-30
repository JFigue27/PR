import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import { UsersPage } from '../users/users-page';
import { SuppliersPage } from '../suppliers/suppliers-page';
import { DepartmentPage } from '../department-page/department-page';

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
  
  OpenDepartment() {
    this.nav.push(DepartmentPage);
  }

  OpenAccount() {
    this.nav.push(SuppliersPage);
  }
}
