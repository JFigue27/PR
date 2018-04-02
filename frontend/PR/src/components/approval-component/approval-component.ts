import { Component, OnInit } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { ListController } from '../../services/ListController';
import { NavController, App } from 'ionic-angular';
import { PRPage } from '../../pages/pr-page/pr-page';

@Component({
  selector: 'approval-component',
  templateUrl: 'approval-component.html'
})
export class ApprovalComponent extends ListController implements OnInit {
  constructor (
                public nav: NavController,
                public approvalService: ApprovalServiceProvider,
                private app: App
            ) {
          super({ service: approvalService });
          this.baseList =[];
      }

  ngOnInit() {
    this.app.viewWillEnter.subscribe(viewCtrl => {
      if (viewCtrl.name == "ApprovalPage") {
        this.load();
      }
    });
  }

  getIconStatus(status:string){
    return "<ion-icon name='getIconStatus(item.status)'></ion-icon> ";
  }

  afterLoad() {
  }

  onOpenItem(oEntity: any) {
    this.nav.push(PRPage, { oEntityOrId: oEntity.PurchaseRequestKey });
  } 

  afterRemove() {
    this.load();
  }

  afterCreate() {
  }

}