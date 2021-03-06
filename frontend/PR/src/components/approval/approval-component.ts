import { Component, OnInit } from '@angular/core';
import { ApprovalService } from '../../services/approval.service';
import { ListController } from '../../core/ListController';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sort } from '@angular/material';
import { OidcService } from '../../core/oidc.service';

@Component({
  selector: 'approval-component',
  templateUrl: 'approval-component.html'
})
export class ApprovalComponent extends ListController implements OnInit {
  statuses = [
    { value: '', viewValue: 'All' },
    { value: 'Pending', viewValue: 'Pending' },
    { value: 'DM Quote', viewValue: 'DM Quote' },
    { value: 'GM Quote', viewValue: 'GM Quote' },
    { value: 'DM Rejected', viewValue: 'DM Rejected' },
    { value: 'GM Rejected', viewValue: 'GM Rejected' },
    { value: 'MRO Quoted', viewValue: 'MRO Quoted' },
    { value: 'PM Approved', viewValue: 'PM Approved' },
    { value: 'PM Rejected', viewValue: 'PM Rejected' },
    { value: 'DM Approved', viewValue: 'DM Approved' },
    { value: 'GM Approved', viewValue: 'GM Approved' },
    { value: 'Finalized', viewValue: 'Finalized' }
  ];

  constructor(public approvalService: ApprovalService,
    public userService: UserService,
    public spinner: NgxSpinnerService,
    private oidc: OidcService) {
    super({ service: approvalService, paginate: true, limit: 20, filterName: 'AprovalFilter' });

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
    this.spinner.show();
    this.clearFilters();
    this.load().catch(error => {
      this.spinner.hide();
    });
  }
  sortData(sort: Sort) {
    console.log(sort);
    this.sortOptions[sort.active] = sort.direction;
    this.refresh();
    this.clearSorts();
  }

  filterStatus(oEvent: any) {
    this.filterOptions.Status = oEvent.value;
    this.refresh();
  }

  getIconStatus(status: string) {
    return "<ion-icon name='getIconStatus(item.status)'></ion-icon> ";
  }

  getStatusStyle(status: string) {
    if (this.userService.LoggedUser.Role == "User") {
      if (status == 'DM Rejected' || status == 'GM Rejected') {
        return "row-pending";
      }
    }

    if (this.userService.LoggedUser.Role == "MRO") {
      if (status == 'DM Quote' || status == "GM Quote" || status == "PM Rejected") {
        return "row-pending";
      }
    }

    if (this.userService.LoggedUser.Role == "Project Manager") {
      if (status == "DM Approved") {
        return "row-pending";
      }
    }

    if (this.userService.LoggedUser.Role == "Department Manager" || this.userService.LoggedUser.Role == "General Manager") {
      if (status == 'Pending' || status == "PM Approved") {
        return "row-pending";
      }
    }

    if (this.userService.LoggedUser.Role == "Purchasing Manager") {
      if (status == 'MRO Quoted' || status == "DM Quote Rejected" || status == "GM Quote Rejected") {
        return "row-pending";
      }
    }

  }

  afterLoad() {
    this.spinner.hide();
  }

  onOpenItem(oEntity: any) {
    // this.nav.push(PRPage, { oEntityOrId: oEntity.PurchaseRequestKey });
  }

  afterRemove() {
    this.load();
  }

  afterCreate() {
  }

}