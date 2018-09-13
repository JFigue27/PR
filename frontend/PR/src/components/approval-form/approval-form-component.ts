import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ApprovalService } from '../../services/approval.service';
import { PRService } from '../../services/pr.service';
import { FormController } from '../../core/FormController';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog-component';

@Component({
  selector: 'approval-form-component',
  templateUrl: 'approval-form-component.html',
})

export class ApprovalFormComponent extends FormController implements OnInit {
  // private users = [];
  private response: string;
  @Input() pr: any;
  @Input() approverKey: number;

  constructor(
    public approvalService: ApprovalService,
    public PRService: PRService,
    public userService: UserService,
    public dialog: MatDialog
  ) {
    super({ service: approvalService });

  }

  ngOnInit() {
    // if (this.userService.LoggedUser.UserKey) {
    //   this.userService.loadEntities().then(oResult => {
    //     this.users = oResult.Result;
    //   });
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pr && changes.pr.currentValue.AAA_EntityName) {
      this.approvalService.getSingleWhere('PurchaseRequestKey', this.pr.PurchaseRequestKey).then(oResponse => {
        this.load(oResponse.Result);
      });
    }
  }

  afterCreate() {
    this.baseEntity.ConvertedDateRequested = new Date();
  }

  saveApproval(status, type?: any) {

    let dialogRef = this.dialog.open(DialogComponent, {
      width: '550px',
      height: '250px',
      data: { messageDialog: 'Identifier', optional1: this.pr.FriendlyIdentifier }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result == true) {
        this.pr.api_attachments.uploadFiles().then(response => {
          console.log('after upload files');
          this.PRService.save(this.pr).then(r => {
            this.baseEntity.editMode = true;
            this.response = this.baseEntity.ResponseDescription;
            this.baseEntity.ConvertedDateResponse = new Date();
            this.baseEntity.PRType = type;
            this.baseEntity.Status = status;
            this.save();
          });
        });
      }
    });
  }

  getCurrentRole() {
    return this.userService.LoggedUser.Role;
  }

  getCurrentUser() {
    return this.userService.LoggedUser;
  }

  afterLoad() {
    this.pr.ApprovalStatus = this.baseEntity.Status;
  }

  showButtons() {
    let status = this.baseEntity.Status;
    let role = this.userService.LoggedUser.Role;
    switch (role) {
      case "User":
        if (!status || status == "Pending" || status == "Rejected") return true;
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
    this.baseEntity.UserApproverKey = this.pr.DepartmentManagerKey;
    this.pr.PRType = this.baseEntity.PRType;
  }

  afterSave() {
    this.pr.ApprovalStatus = this.baseEntity.Status;
  }

  afterRemove() {

  }
}
