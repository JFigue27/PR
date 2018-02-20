import { Component, OnInit } from '@angular/core';
import { UserServiceProvider } from '../../providers/user-service';
import { ModalController } from 'ionic-angular';
import { UserFormComponent } from '../user-form/user-form-component';
import { ListController } from '../../services/ListController';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'users-component',
  templateUrl: 'users-component.html'
})
export class UsersComponent extends ListController implements OnInit {

  constructor (
          public dialog:MatDialog,
          public userService: UserServiceProvider
          ){
            super({ service: userService });
          }

  ngOnInit() {
    this.load();
  }
  
  addItem() {
    this.dialog.open(UserFormComponent, {
      data: { oEntityOrId: null }
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    this.dialog.open(UserFormComponent, {
      data: { oEntityOrId: oEntity.id }
    });
  }
  
  afterRemove() {
    this.load();
  }
  
  afterCreate() {
  }

}
