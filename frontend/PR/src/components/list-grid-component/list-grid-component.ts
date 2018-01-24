import { Component, Input, OnChanges } from '@angular/core';
import { ListController } from '../../services/ListController';
import { NavController } from 'ionic-angular';
import { ListFormPage } from '../../pages/list-form-page/list-form-page';
import { PrlineServiceProvider } from '../../providers/prline-service/prline-service';


@Component({
  selector: '[list-grid-component]',
  templateUrl: 'list-grid-component.html'
})
export class ListGridComponent extends ListController implements OnChanges {
  @Input() parent: any;

  constructor(public prLineService: PrlineServiceProvider, public nav: NavController) {
    super({ service: prLineService, paginate: false });
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('parent')) {
      if (changes.parent.currentValue.id > 0) {
        console.log('list-grid-component > onchanges');
        console.log(changes);
        this.load('PurchaseRequestKey=' + changes.parent.currentValue.id);
      }
    }
  }

  addItem() {
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