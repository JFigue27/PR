import { Component, OnInit } from '@angular/core';
import { ListController } from '../../core/ListController';
import { NavController } from 'ionic-angular';
import { PRPage } from '../../pages/pr-page/pr-page';
import { PRService } from '../../services/pr.service';
import { UserService } from '../../services/user.service';
import { PageEvent, MatDialog } from '@angular/material';
import { utils } from '../../common/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogComponent } from '../dialog/dialog-component';

@Component({
  selector: 'list-component',
  templateUrl: 'list-component.html'
})
export class ListComponent extends ListController implements OnInit {
  messageDialog:string;
  constructor (
                public userService:UserService,
                public PrService: PRService,
                public nav: NavController,
                public spinner:NgxSpinnerService,
                public dialog:MatDialog
              ) {
                  super({ service: PrService, paginate: true, limit: 20, filterName: 'prFilter' });
              }

  ngOnInit() {
    this.spinner.show();
    let PrKey = utils.getParameterByName('id', null);
    if (PrKey) {
      window.history.replaceState({}, document.title, "/PR/Main");
      this.nav.push(PRPage, { oEntityOrId: PrKey });
    } else if (this.userService.LoggedUser.Roles == "Administrator") {
      this.load();
    } else {
      this.load('filterUser=' + this.userService.LoggedUser.UserKey);
    }
    this.spinner.hide();
  }
  
  onPageChanged(pageEvent: PageEvent){
    this.pageChanged(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }

  addItem() {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '550px',
      height: '250px',
      data: { messageDialog:'Please confirm to create a new Purchase Request', responseDialog: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result == true) { 
        this.PrService.createInstance().subscribe(oInstance => {
          oInstance.DepartmentAssigned.Manager = null;
          this.PrService.createEntity(oInstance).then(oEntity => {
            this.nav.push(PRPage, { oEntityOrId: oEntity });
          });
        });
      }
    });
  }
  
  afterLoad() {
  }

  onOpenItem(oEntity: any) {
    this.nav.push(PRPage, { oEntityOrId: oEntity.id });
  }

  afterRemove() {
  }

  afterCreate() {
  }


}
