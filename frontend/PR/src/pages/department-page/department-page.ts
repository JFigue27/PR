import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { UsersPage } from '../users/users-page';
import { SuppliersPage } from '../suppliers/suppliers-page';
import { ApprovalPage } from '../approval-page/approval-page';
import { LoginComponent } from '../../components/login/login';
import { UserServiceProvider } from '../../providers/user-service';
import { EmailPage } from '../email-page/email-page';
import { ListPage } from '../list-page/list-page';
import { AccountPage } from '../account-page/account-page';

@Component({
  selector: 'department-page',
  templateUrl: 'department-page.html',
})
export class DepartmentPage {

  user: string;
  constructor(
    public nav: NavController,
    public modal: ModalController,
    public userService: UserServiceProvider
  ) {
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

  afterLoad() {
    this.user = this.userService.LoggedUser.UserName;
  }
}
