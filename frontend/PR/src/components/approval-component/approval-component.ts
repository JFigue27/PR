import { Component, OnInit } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { ListController } from '../../services/ListController';
import { ApprovalFormComponent } from '../approval-form-component/approval-form-component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'approval-component',
  templateUrl: 'approval-component.html'
})
export class ApprovalComponent extends ListController implements OnInit {
  constructor (
                public dialog:MatDialog,
                public approvalService: ApprovalServiceProvider
              ) {
                  super({ service: approvalService });
              }

  ngOnInit() {
    this.load();
  }
 
  addItem() {
    this.dialog.open(ApprovalFormComponent, { data: { oEntityOrId: null}
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    this.dialog.open(ApprovalFormComponent, {
      data: { oEntityOrId: oEntity.id }
    });
  }

  afterRemove() {
    this.load();
  }

  afterCreate() {
  }

}