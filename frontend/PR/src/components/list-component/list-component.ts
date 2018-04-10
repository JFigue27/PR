import { Component, OnInit } from '@angular/core';
import { ListController } from '../../services/ListController';
import { NavController } from 'ionic-angular';
import { PRPage } from '../../pages/pr-page/pr-page';
import { PRServiceProvider } from '../../providers/pr-service';
import { App } from 'ionic-angular/components/app/app';
import { UserServiceProvider } from '../../providers/user-service';
import { PageEvent } from '@angular/material';
import { utils } from '../../common/utils';

@Component({
  selector: 'list-component',
  templateUrl: 'list-component.html'
})
export class ListComponent extends ListController implements OnInit {
  constructor (
                public userService:UserServiceProvider,
                public PrService: PRServiceProvider,
                public nav: NavController,
                private app: App
              ) {
                  super({ service: PrService, paginate: true, limit: 10, filterName: 'prFilter' });
              }

  ngOnInit() {

    this.app.viewWillEnter.subscribe(viewCtrl => {
      if (viewCtrl.name == "ListPage") {
        let PrKey = utils.getParameterByName('id', null);
        if (PrKey) {

          window.history.replaceState({}, document.title, "/PR/Main");
          this.nav.push(PRPage, { oEntityOrId: PrKey });
        } else {
          this.load('filterUser='+this.userService.LoggedUser.UserKey);
        }
      }
    });
  }
  
  onPageChanged(pageEvent: PageEvent){
    this.pageChanged(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }


  addItem() {
    if (confirm('Are you sure you want to create a new PR?')) {
      this.PrService.createInstance().subscribe(oInstance => {
        this.PrService.createEntity(oInstance).subscribe(oEntity => {
          this.nav.push(PRPage, { oEntityOrId: oEntity });
        });
      });
 }

        

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
