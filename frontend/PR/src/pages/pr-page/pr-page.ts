import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { UsersPage } from '../users/users-page';
import { SuppliersPage } from '../suppliers/suppliers-page';
import { DepartmentPage } from '../department-page/department-page';
import { LoginComponent } from '../../components/login/login';
import { UserServiceProvider } from '../../providers/user-service';
import { ListPage } from '../list-page/list-page';
import { AccountPage } from '../account-page/account-page';
import { ApprovalPage } from '../approval-page/approval-page';
import { EmailPage } from '../email-page/email-page';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'pr-page',
  templateUrl: 'pr-page.html',
})
export class PRPage {

  private user: string;
  mode = new FormControl('over');

  constructor ( public nav: NavController, public modal: ModalController, public userService: UserServiceProvider ) {
    this.user = this.userService.LoggedUser.UserName;
  }

  openUser() {
    this.nav.push(UsersPage);
  }

  openSupplier() {
    this.nav.push(SuppliersPage);
  }

  openDepartment() {
    this.nav.push(DepartmentPage);
  }

  openAccount() {
    this.nav.push(AccountPage);
  }

  openApproval() {
    this.nav.push(ApprovalPage);
  }

  openPR() {
    this.nav.push(ListPage);
  }

  openProfile() {
    this.nav.push(EmailPage);
  }

  logout() {
    localStorage.clear();
    let profileModal = this.modal.create(LoginComponent, null, { showBackdrop: true, enableBackdropDismiss: false });
    profileModal.present();
  }

  getUserName() {
    return this.userService.LoggedUser.UserName;
  }

  getUserRole() {
    return this.userService.LoggedUser.Roles;
  }

  afterLoad() {
    this.user = this.userService.LoggedUser.UserName;
  }
}

