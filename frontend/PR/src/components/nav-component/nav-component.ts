import { Component, OnInit } from '@angular/core';
import { ListController } from '../../services/ListController';
import { NavController } from 'ionic-angular';
import { PRPage } from '../../pages/pr-page/pr-page';
import { PRServiceProvider } from '../../providers/pr-service';
import { App } from 'ionic-angular/components/app/app';
import { UserServiceProvider } from '../../providers/user-service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'nav-component',
  templateUrl: 'nav-component.html'
})
export class NavComponent extends ListController implements OnInit {
  constructor (
                public userService:UserServiceProvider,
                public PrService: PRServiceProvider,
                public nav: NavController,
                private app: App
              ) {
                super({ service: PrService, paginate: true, limit: 2 });
              }

  ngOnInit() {

    this.app.viewWillEnter.subscribe(viewCtrl => {
      if (viewCtrl.name == "ListPage") {
        this.load('filterUser='+this.userService.LoggedUser.UserKey);
      }
    });
  }
  
  onPageChanged(pageEvent: PageEvent){
    this.pageChanged(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }


  addItem() {
    this.PrService.createInstance().subscribe(oInstance => {
      this.PrService.createEntity(oInstance).subscribe(oEntity => {
        this.nav.push(PRPage, { oEntityOrId: oEntity });
      });
    });
  }
  
  afterLoad() {
  }

  onOpenItem(oEntity: any) {
    this.nav.push(PRPage, { oEntityOrId: oEntity.id });
  }

  afterRemove() {
  }

  afterCreate() {
  }


}
