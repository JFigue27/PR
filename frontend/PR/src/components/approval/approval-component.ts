import { Component, OnInit } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { ListController } from '../../services/ListController';
import { NavController } from 'ionic-angular';
import { PRPage } from '../../pages/pr-page/pr-page';
import { UserServiceProvider } from '../../providers/user-service';
import { NgxSpinnerService } from 'ngx-spinner';

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


  constructor ( 
                public nav: NavController,
                public approvalService: ApprovalServiceProvider,
                public userService:UserServiceProvider,
                public spinner: NgxSpinnerService
              ) 
            {
              super({ service: approvalService, paginate: true, limit: 20, filterName: 'AprovalFilter' });
            }

  ngOnInit() {
      this.spinner.show();
      this.clearFilters();
      this.load();
      this.spinner.hide();
  }

  filterStatus(oEvent:any) {
    this.filterOptions.Status = oEvent.value;
    this.refresh();
  }

  getIconStatus(status:string){
    return "<ion-icon name='getIconStatus(item.status)'></ion-icon> ";
  }

  getStatusStyle(status: string) {

    if (status == "DM Rejected" || status == "PM Rejected" ){
      return "row-rejected";
    }

    if (this.userService.LoggedUser.Roles == "User") {
      if (status == 'DM Rejected' || status == 'GM Rejected') {
        return "row-pending";
      }
    }

    if (this.userService.LoggedUser.Roles == "MRO") {
      if (status == 'DM Quote' || status == "GM Quote" || status == "PM Rejected") {
        return "row-pending";
      }
    }
    
    if (this.userService.LoggedUser.Roles == "Department Manager" || this.userService.LoggedUser.Roles == "General Manager" ){
      if (status == 'Pending' || status == "PM Approved") {
        return "row-pending";
      }
    }

    if (this.userService.LoggedUser.Roles == "Purchasing Manager") {
      if (status == 'MRO Quoted' || status == "DM Quote Rejected"  || status == "GM Quote Rejected") {
        return "row-pending";
      }
    }

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