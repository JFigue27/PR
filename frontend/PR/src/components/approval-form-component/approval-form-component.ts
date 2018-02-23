import { Component, OnInit, Inject } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { FormController } from '../../services/FormController';
import { UserServiceProvider } from '../../providers/user-service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'approval-form-component',
  templateUrl: 'approval-form-component.html',
})

export class ApprovalFormComponent extends FormController implements OnInit {
  users = [];
  constructor (
          @Inject(MAT_DIALOG_DATA) public data: any,
          public approvalService: ApprovalServiceProvider,
          public userService: UserServiceProvider
      ) { 
        super({ service: approvalService }); 
      }

  ngOnInit() {
    this.userService.loadEntities().subscribe(oResult => {
      this.users = oResult.Result;
    });
    this.load(this.data.oEntityOrId);

  }
  
  close() { 
  }
  
  afterCreate() { 
    this.baseEntity.ConvertedDateRequested = new Date();
    this.baseEntity.UserRequisitorKey = this.userService.LoggedUser.UserKey;
    this.baseEntity.PurchaseRequestKey = this.data.PurchaseRequestKey;
  }

  approvePr(){
    this.baseEntity.Status = 'Approved';
    this.baseEntity.editMode = true;
    this.baseEntity.ConvertedDateResponse = new Date();
    this.save();
  }

  rejectPr() {
    this.baseEntity.Status = 'Rejected';
    this.baseEntity.editMode = true;
    this.baseEntity.ConvertedDateResponse = new Date();
    this.save();
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
