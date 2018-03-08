import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { FormController } from '../../services/FormController';
import { UserServiceProvider } from '../../providers/user-service';
import { MatDialog } from '@angular/material';
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
  let dialog = this.dialog.open(confirmComponent, {
    width: '300px', data: { response: this.baseEntity.ResponseDescription }
  });
  dialog.afterClosed().subscribe(result => {
      this.baseEntity.editMode = true;
      this.response = this.baseEntity.ResponseDescription;
      this.baseEntity.ConvertedDateResponse = new Date();
      this.baseEntity.ResponseDescription = result;
      this.baseEntity.Status = status;
      this.save();
    });

  }

  getCurrentRole() {
    return this.userService.LoggedUser.Roles;
  }

  afterLoad() {
    this.pr.ApprovalStatus = this.baseEntity.Status;
  }

  afterSave() { 
  }

  afterRemove() {
  }
}

