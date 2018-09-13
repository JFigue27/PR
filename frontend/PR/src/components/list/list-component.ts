import { Component, OnInit } from '@angular/core';
import { ListController } from '../../core/ListController';
import { PRService } from '../../services/pr.service';
import { UserService } from '../../services/user.service';
import { PageEvent, MatDialog } from '@angular/material';
import { utils } from '../../common/utils';
import { DialogComponent } from '../dialog/dialog-component';
import { Router } from '@angular/router';
import { OidcService } from '../../core/oidc.service';

@Component({
  selector: 'list-component',
  templateUrl: 'list-component.html'
})
export class ListComponent extends ListController implements OnInit {
  messageDialog: string;
  constructor(private router: Router,
    public userService: UserService,
    public PrService: PRService,
    public dialog: MatDialog,
    private oidc: OidcService
  ) {
    super({ service: PrService, paginate: true, limit: 20, filterName: 'prFilter' });

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
    let PrKey = utils.getParameterByName('id', null);
    if (PrKey) {
      window.history.replaceState({}, document.title, "/PR/Main");
    } else if (this.userService.LoggedUser.Role == "Administrator") {
      this.load();
    } else if (this.userService.LoggedUser.UserKey) {
      this.load('filterUser=' + this.userService.LoggedUser.UserKey);
    }
  }

  onPageChanged(pageEvent: PageEvent) {
    this.pageChanged(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }

  addItem() {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '550px',
      height: '250px',
      data: { messageDialog: 'Please confirm to create a new Purchase Request', responseDialog: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result == true) {
        this.PrService.createInstance().then(oInstance => {
          oInstance.DepartmentAssigned.Manager = null;
          this.PrService.createEntity(oInstance).then(oEntity => {
            console.log("oEntity " + oEntity.id);
            this.router.navigate(['/pr/' + oEntity.id]);
          });
        });
      }
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity: any) {
    // this.nav.push(PRPage, { oEntityOrId: oEntity.id });
  }

  afterRemove() {
  }

  afterCreate() {
  }


}
