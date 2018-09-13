import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { ListController } from '../../core/ListController';
import { SupplierFormComponent } from '../supplier-form/supplier-form-component';
import { MatDialog } from '@angular/material';
import { OidcService } from '../../core/oidc.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'suppliers-component',
  templateUrl: 'suppliers-component.html'
})
export class SuppliersComponent extends ListController implements OnInit {
  constructor(public dialog: MatDialog,
    public supplierService: SupplierService,
    public userService: UserService,
    private oidc: OidcService) {
    super({ service: supplierService, paginate: true, limit: 20, filterName: 'SupplierFilter' });

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
    let dialog = this.dialog.open(SupplierFormComponent, {
      data: { oEntityOrId: null }
    });

    dialog.afterClosed().subscribe(result => {
      this.load();
    });

  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let dialog = this.dialog.open(SupplierFormComponent, {
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
