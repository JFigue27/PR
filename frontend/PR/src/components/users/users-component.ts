import { Component, OnInit } from '@angular/core';
import { UserServiceProvider } from '../../providers/user-service';
import { UserFormComponent } from '../user-form/user-form-component';
import { ListController } from '../../services/ListController';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'users-component',
  templateUrl: 'users-component.html'
})
export class UsersComponent extends ListController implements OnInit {

  constructor ( public dialog:MatDialog, public userService: UserServiceProvider) {
            super({ 
              service: userService,
              paginate: true,
              limit: 20,
              filterName: 'UserFilter' });
          }

  ngOnInit() {  
    this.load();
  }
  
  addItem() {
    let dialog = this.dialog.open(UserFormComponent, {
      data: { oEntityOrId: null }
    });
    
    dialog.afterClosed().subscribe(result => {
      this.load();
    });
  }

  afterLoad() {
  }

  onOpenItem(oEntity) {
    let dialog = this.dialog.open(UserFormComponent, {
      data: { oEntityOrId: oEntity.id }
    });

    dialog.afterClosed().subscribe(result => {
      this.load();
    });
  }
  
  afterRemove() {
    this.load();
  }
  
  afterCreate() {
  }

}
