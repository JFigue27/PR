import { Component, OnInit } from '@angular/core';
import { ListController } from '../../services/ListController';
import { NavController } from 'ionic-angular';
import { FormPage } from '../../pages/form-page/form-page';
import { PRServiceProvider } from '../../providers/pr-service';
import { App } from 'ionic-angular/components/app/app';

@Component({
  selector: 'list-component',
  templateUrl: 'list-component.html'
})
export class ListComponent extends ListController implements OnInit {

  constructor(public listService: PRServiceProvider, public nav: NavController, private app: App) {
    super({ service: listService, paginate: true, limit: 10 });

  }

  ngOnInit() {

    this.app.viewWillEnter.subscribe(viewCtrl => {
      if (viewCtrl.name == "ListPage") {
        console.log('Entering component view 2');
        this.load();
      }
      console.log(viewCtrl);
    });
  }

  addItem() {
    this.nav.push(FormPage, { oEntityOrId: null });
  }

  afterLoad() {
  }

  onOpenItem(oEntity: any) {
    this.nav.push(FormPage, { oEntityOrId: oEntity.id });
  }

  afterRemove() {
  }

  afterCreate() {
  }


}