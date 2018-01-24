import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { ListPage } from '../../pages/list-page/list-page';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public nav: Nav) {

  }
  openList(){
    this.nav.push(ListPage);
  }
}
