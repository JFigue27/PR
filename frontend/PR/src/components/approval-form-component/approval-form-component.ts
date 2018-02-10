import { Component, OnInit } from '@angular/core';
import { ApprovalServiceProvider } from '../../providers/approval-service';
import { FormController } from '../../services/FormController';
import { NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service';

@Component({
  selector: 'approval-form-component',
  templateUrl: 'approval-form-component.html',
  styleUrls: ['/component/approval-form-component.scss'],
})

export class ApprovalFormComponent extends FormController implements OnInit {
  users = [];
  constructor (
          public approvalService: ApprovalServiceProvider,
          public userService: UserServiceProvider,
          private params: NavParams,
      ) { super({ service: approvalService }); }

  ngOnInit() {
    this.userService.loadEntities().subscribe(oResult => {
      this.users = oResult.Result;
    });
    this.load(this.params.get('oEntityOrId'));
  }

  close() { 
  }

  afterCreate() {
    this.baseEntity.PurchaseRequestKey = this.params.get('PurchaseRequestKey');
  }

  afterLoad() {
  }

  afterSave() { 
  }

  afterRemove() {
  }
}
