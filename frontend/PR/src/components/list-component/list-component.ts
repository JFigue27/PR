import { Component, OnInit } from '@angular/core';
import { ListController } from '../../services/ListController';
import { NavController } from 'ionic-angular';
import { ListFormPage } from '../../pages/list-form-page/list-form-page';
import { PRServiceProvider } from '../../providers/pr-service';


@Component({
  selector: 'list-component',
  templateUrl: 'list-component.html'
})
export class ListComponent extends ListController implements OnInit {

  constructor(public listService:PRServiceProvider, public nav: NavController) {
    super( { service: listService, paginate:true, limit: 10 } );
  }

  ngOnInit(){
    this.load();
  }


  addItem(){
    this.nav.push(ListFormPage);
  }

  afterLoad() {
  }

  onOpenItem(oEntity: any) {
    this.nav.push(ListFormPage, { oEntityOrId: oEntity.id });
  }

  afterRemove() {
  }

  afterCreate() {
  }


}
