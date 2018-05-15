import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SuppliersPage } from '../../pages/suppliers/suppliers-page';
import { UsersPage } from '../../pages/users/users-page';
import { DepartmentPage } from '../../pages/department-page/department-page';
import { AccountPage } from '../../pages/account-page/account-page';
import { ApprovalPage } from '../../pages/approval-page/approval-page';
import { ListPage } from '../../pages/list-page/list-page';
import { EmailPage } from '../../pages/email-page/email-page';
import { LoginComponent } from '../login/login';

@Component({
    selector: 'home-component',
    templateUrl: 'home-component.html'
})
export class HomeComponent {
    constructor(public nav: NavController, public modal:ModalController ) {  }

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
}
