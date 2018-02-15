import { Component } from '@angular/core';
import {  NavController, ModalController } from 'ionic-angular';
import { UsersPage } from '../users/users-page';
import { SuppliersPage } from '../suppliers/suppliers-page';
import { DepartmentPage } from '../department-page/department-page';
import { AccountPage } from '../account-page/account-page';
import { ApprovalPage } from '../approval-page/approval-page';
import { LoginComponent } from '../../components/login/login';
import { UserServiceProvider } from '../../providers/user-service';
import { ListController } from '../../services/ListController';

@Component({
  selector: 'list-page',
  templateUrl: 'list-page.html',
})
export class ListPage extends ListController {
  
  user:string;
  constructor(
              public navCtrl: NavController,
              public nav: NavController,
              public modal:ModalController,
              public userService:UserServiceProvider
            ) {
    super({ service: userService });
    this.user = this.userService.LoggedUser.UserName;
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
    this.nav.push(AccountPage);
  }

  OpenApproval() {
    this.nav.push(ApprovalPage);
  }

  logout(){
    localStorage.clear();
    let profileModal = this.modal.create(LoginComponent, null, { showBackdrop: true, enableBackdropDismiss: false });
    profileModal.present();
  }

  getUserName(){
    return this.userService.LoggedUser.UserName;
  }

  afterLoad() {
    this.user = this.userService.LoggedUser.UserName;
  }

  onOpenItem(oEntity: any) {

  }
  
  afterRemove() {

  }
  
  afterCreate() {

  }
}
