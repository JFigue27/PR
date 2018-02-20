import { Component, OnInit } from '@angular/core';
import { AccountServiceProvider } from '../../providers/account-service';
import { AccountFormComponent } from '../account-form-component/account-form-component';
import { ListController } from '../../services/ListController';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'account-component',
  templateUrl: 'account-component.html'
})
export class AccountComponent extends ListController implements OnInit {
  constructor (
                public dialog:MatDialog,
                public accountService: AccountServiceProvider
              ) {
                  super({ service: accountService });
              }

  ngOnInit() {
    this.load();
  }

  addItem() {
    this.dialog.open(AccountFormComponent, {
      data: { oEntityOrId: null }
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    this.dialog.open(AccountFormComponent, {
      data: { oEntityOrId: oEntity.id }
    });
  }

  afterRemove() {
    this.load();
  }

  afterCreate() {
  }

}