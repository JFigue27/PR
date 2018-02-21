import { Component, OnInit } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { ListController } from '../../services/ListController';
import { PRComponent } from '../pr-component/pr-component';
import { MatDialog } from '@angular/material';
import { NavController } from 'ionic-angular';
import { PRPage } from '../../pages/pr-page/pr-page';

@Component({
  selector: 'approval-component',
  templateUrl: 'approval-component.html'
})
export class ApprovalComponent extends ListController implements OnInit {
  constructor (
                public dialog:MatDialog,
                public nav: NavController,
                public approvalService: ApprovalServiceProvider
              ) {
                  super({ service: approvalService });
              }

  ngOnInit() {
    this.load();
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