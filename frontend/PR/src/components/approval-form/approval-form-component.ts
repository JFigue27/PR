import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { FormController } from '../../services/FormController';
import { UserServiceProvider } from '../../providers/user-service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'approval-form-component',
  templateUrl: 'approval-form-component.html',
})

export class ApprovalFormComponent extends FormController implements OnInit {
  private users = [];
  private response: string; 
  @Input() pr: any;
  @Input() approverKey: number;
  constructor (
          public approvalService: ApprovalServiceProvider,
          public userService: UserServiceProvider,
          public dialog: MatDialog
      ) { 
        super({ service: approvalService }); 
      }

  ngOnInit() {
    this.userService.loadEntities().subscribe(oResult => {
      this.users = oResult.Result;
    });
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pr && changes.pr.currentValue.AAA_EntityName) {
      this.approvalService.getSingleWhere('PurchaseRequestKey', this.pr.PurchaseRequestKey).subscribe(oResponse => {
        this.load(oResponse.Result);
      });  
    }
  }

  close() { 
  }
  
  afterCreate() { 
    this.baseEntity.ConvertedDateRequested = new Date();
  }
  
  requestApproval(status) {
    if (confirm('confirm request') ) {
      this.baseEntity.editMode = true;
      this.response = this.baseEntity.RequestDescription;
      this.baseEntity.ConvertedDateResponse = new Date();
      this.baseEntity.Status = status;
      this.save();
      }; 
  }


  answerApproval(status, type?: any) {
    if (confirm('Confirm response status: ' + status)) {
      this.baseEntity.editMode = true;
      this.response = this.baseEntity.ResponseDescription;
      this.baseEntity.ConvertedDateResponse = new Date();
      this.pr.PRType = type;
      this.baseEntity.Status = status;
      this.save();
    }; 
    
  }
  
  getCurrentRole() {
    return this.userService.LoggedUser.Roles;
  }

  getCurrentUser() {
    return this.userService.LoggedUser;
  }

  afterLoad() {
    this.pr.ApprovalStatus = this.baseEntity.Status;
  }

  showButtons() {
    let status = this.baseEntity.Status;
    let role = this.userService.LoggedUser.Roles;
    
    console.log('BEGIN SWITCH role ' + role + ' status ' + status);
    switch (role) {
      case "User":
      if ( !status || status == "Pending" || status == "Rejected") return true;
        break;
      case "MRO":
        if (status == "MRO Quote" || status == "Quote Rejected") return true;
        break;
      case "Department Manager":
        if (status || status == "Pending" || status == "MRO Quoted") return true;
        break;
      case "General Manager":
        if (status || status == "Pending" || status == "MRO Quoted") return true;
        break;
      case "Buyer":
        if (status || status == "Approved") return false;
        break;
      default:
        return false;
    }
  }
  
  beforeSave() {
    this.baseEntity.Title = "Purchase Request - " + this.pr.FriendlyIdentifier;
    this.baseEntity.UserApproverKey = this.approverKey;
  }

  afterSave() {
    this.pr.ApprovalStatus = this.baseEntity.Status;
  }

  afterRemove() {
  }
}

