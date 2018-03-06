import { Component, OnInit, Input, SimpleChanges, Inject } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { FormController } from '../../services/FormController';
import { UserServiceProvider } from '../../providers/user-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { confirmComponent } from '../confirm-component/confirm-component';

@Component({
  selector: 'approval-form-component',
  templateUrl: 'approval-form-component.html',
})

export class ApprovalFormComponent extends FormController implements OnInit {
  users = [];
  response: string;
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

    if (changes.pr && changes.pr.firstChange == false) {

      this.approvalService.getSingleWhere('PurchaseRequestKey', this.pr.PurchaseRequestKey)
      .subscribe(oResponse => {
        this.load(oResponse.Result);
      });  
    }
  }


  close() { 
  }
  
  afterCreate() { 
    this.baseEntity.ConvertedDateRequested = new Date();
    this.baseEntity.UserRequisitorKey = this.userService.LoggedUser.UserKey;
    this.baseEntity.UserApproverKey = this.pr.DepartmentManagerKey;
    this.baseEntity.PurchaseRequestKey = this.pr.PurchaseRequestKey;
  }

  answerApproval(status) {
    this.baseEntity.Status = status;
    this.baseEntity.editMode = true;
    this.response = this.baseEntity.ResponseDescription;
    this.baseEntity.ConvertedDateResponse = new Date();
    let dialog = this.dialog.open(confirmComponent, {
      width: '300px',
      data: { response: this.baseEntity.ResponseDescription }
    });
    dialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.baseEntity.ResponseDescription = result;
      this.save();
    });

  }

  getCurrentRole() {
    return this.userService.LoggedUser.Roles;
  }

  afterLoad() {
  }

  afterSave() { 
  }

  afterRemove() {
  }
}

