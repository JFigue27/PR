import { Component, OnInit } from '@angular/core';
import { AccountServiceProvider } from '../../providers/account-service';
import { AccountFormComponent } from '../account-form/account-form-component';
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
                  super({ service: accountService, paginate: true, limit: 20, filterName: 'AccountFilter' });
              }

  ngOnInit() {
    this.load();
  }

  addItem() {
    let dialog = this.dialog.open(AccountFormComponent, {
      data: { oEntityOrId: null }
    });

    dialog.afterClosed().subscribe(result => {
      this.load();
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let dialog = this.dialog.open(AccountFormComponent, {
      data: { oEntityOrId: oEntity.id }
    });

    dialog.afterClosed().subscribe(result => {
      this.load();
    });

  }

  afterRemove() {
    this.load();
  }

  afterCreate() {
  }

}