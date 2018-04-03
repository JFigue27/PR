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
    let dialog = this.dialog.open(confirmComponent, {
      width: '300px', data: { response: this.baseEntity.RequestDescription }
    });
    dialog.afterClosed().subscribe(result => {
      this.baseEntity.editMode = true;
      this.response = this.baseEntity.RequestDescription;
      this.baseEntity.ConvertedDateResponse = new Date();
      this.baseEntity.RequestDescription = result;
      this.baseEntity.Status = status;
      this.save();
    });

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
    // this.baseEntity.UserApproverKey = this.approverKey;
  }
  
  beforeSave() {
    this.baseEntity.Title = "Purchase Request - " + this.pr.FriendlyIdentifier;
    this.baseEntity.UserApproverKey = this.approverKey;
  }

  afterSave() { 
  }

  afterRemove() {
  }
}

