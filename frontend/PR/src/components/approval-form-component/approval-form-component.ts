import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { FormController } from '../../services/FormController';
import { UserServiceProvider } from '../../providers/user-service';
// import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'approval-form-component',
  templateUrl: 'approval-form-component.html',
})

export class ApprovalFormComponent extends FormController implements OnInit {
  users = [];
  @Input() pr: any;
  @Input() approverKey: number;
  constructor (
          public approvalService: ApprovalServiceProvider,
          public userService: UserServiceProvider
      ) { 
        super({ service: approvalService }); 
      }

  ngOnInit() {
    this.userService.loadEntities().subscribe(oResult => {
      this.users = oResult.Result;
    });
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.pr && changes.pr.firstChange == false){

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

  approvePr() {
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
