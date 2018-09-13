import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AccountFormComponent } from '../account-form/account-form-component';
import { ListController } from '../../core/ListController';
import { MatDialog } from '@angular/material';
import { OidcService } from '../../core/oidc.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'account-component',
  templateUrl: 'account-component.html'
})
export class AccountComponent extends ListController implements OnInit {
  constructor(
    public dialog: MatDialog,
    public accountService: AccountService,
    private oidc: OidcService,
    private userService: UserService
  ) {
    super({ service: accountService, paginate: true, limit: 20, filterName: 'AccountFilter' });
    this.oidc.onAuthenticationChange = (auth) => {
      if (auth) {
        this.userService.getByUserName(auth.Value).then(oResponse => {
          this.userService.LoggedUser = oResponse.Result;
          this.ngOnInit();
        });
      } else {
        this.userService.LoggedUser = {};
      }
    }
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