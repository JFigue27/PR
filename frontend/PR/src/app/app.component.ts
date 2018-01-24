import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginComponent } from '../components/login/login';
import { ListPage } from '../pages/list-page/list-page';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  LoggedUser: string;
  @ViewChild(Nav) nav: Nav;
  rootPage: any = ListPage;
  pages: Array<{ title: string, component: any }>;

  constructor( public platform: Platform, public modal: ModalController) {

    this.initializeApp();
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
  }

  initializeApp() {
    if (!localStorage.getItem('access_token')) {
      let profileModal = this.modal.create(LoginComponent, null, { enableBackdropDismiss: true });
      profileModal.dismiss(false);
      profileModal.present();
      this.LoggedUser = localStorage.getItem('userName');
    }
    this.LoggedUser = localStorage.getItem('userName');
  }
 
}

