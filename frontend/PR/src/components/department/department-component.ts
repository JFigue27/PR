import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { ListController } from '../../core/ListController';
import { DepartmentFormComponent } from '../department-form/department-form-component';
import { MatDialog } from '@angular/material';
import { OidcService } from '../../core/oidc.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'department-component',
  templateUrl: 'department-component.html'
})
export class DepartmentComponent extends ListController implements OnInit {

  constructor(
    public departmentSerivceProvider: DepartmentService,
    public dialog: MatDialog,
    public userService: UserService,
    private oidc: OidcService
  ) {
    super({ service: departmentSerivceProvider, paginate: true, limit: 20, filterName: 'DepartmentFilter' });

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
    let dialog = this.dialog.open(DepartmentFormComponent, {
      data: { oEntityOrId: null }
    });

    dialog.afterClosed().subscribe(result => {
      this.load();
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let dialog = this.dialog.open(DepartmentFormComponent, {
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