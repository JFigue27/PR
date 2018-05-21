import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SuppliersPage } from '../../pages/suppliers/suppliers-page';
import { UsersPage } from '../../pages/users/users-page';
import { DepartmentPage } from '../../pages/department-page/department-page';
import { AccountPage } from '../../pages/account-page/account-page';
import { ApprovalPage } from '../../pages/approval-page/approval-page';
import { ListPage } from '../../pages/list-page/list-page';
import { EmailPage } from '../../pages/email-page/email-page';
import { LoginComponent } from '../login/login';
import { utils } from '../../common/utils';
import { PRPage } from '../../pages/pr-page/pr-page';
import { UserServiceProvider } from '../../providers/user-service';

@Component({
    selector: 'home-component',
    templateUrl: 'home-component.html'
})
export class HomeComponent implements OnInit{
    constructor(public nav: NavController, public modal:ModalController, public userService: UserServiceProvider) {  }

    ngOnInit() {
        let PrKey = utils.getParameterByName('id', null);
        if (PrKey) {
            window.history.replaceState({}, document.title, "/PR/Main");
            this.nav.push(PRPage, { oEntityOrId: PrKey });
        } else if (this.userService.LoggedUser.Roles == "Administrator") {
            console.log('A');
        } else {
            console.log('B');
        }
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
}
