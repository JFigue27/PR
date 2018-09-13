import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LoginComponent } from '../login/login';
import { utils } from '../../common/utils';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'home-component',
    templateUrl: 'home-component.html'
})
export class HomeComponent implements OnInit{
    constructor(public nav: NavController, public modal:ModalController, public userService: UserService) {  }

    ngOnInit() {
        let PrKey = utils.getParameterByName('id', null);
        if (PrKey) {
            window.history.replaceState({}, document.title, "/PR/Main");
            // this.nav.push(PRPage, { oEntityOrId: PrKey });
        } else if (this.userService.LoggedUser.Role == "Administrator") {
            console.log('A');
        } else {
            console.log('B');
        }
    }

    openProfile() {
    }

    logout() {
        localStorage.clear();
        let profileModal = this.modal.create(LoginComponent, null, { showBackdrop: true, enableBackdropDismiss: false });
        profileModal.present();
    }
}
