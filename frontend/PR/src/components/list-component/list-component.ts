import { Component, OnInit } from '@angular/core';
import { ListController } from '../../services/ListController';
import { NavController } from 'ionic-angular';
import { PRPage } from '../../pages/pr-page/pr-page';
import { PRServiceProvider } from '../../providers/pr-service';
import { App } from 'ionic-angular/components/app/app';

@Component({
  selector: 'list-component',
  templateUrl: 'list-component.html'
})
export class ListComponent extends ListController implements OnInit {

  constructor (
                public listService: PRServiceProvider,
                public nav: NavController,
                private app: App
            ) {
                super({ service: listService, paginate: true, limit: 10 });
        }

  ngOnInit() {

    this.app.viewWillEnter.subscribe(viewCtrl => {
      if (viewCtrl.name == "ListPage") {
        this.load();
      }
    });
  }

  addItem() {
    this.nav.push(PRPage, { oEntityOrId: null });
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
