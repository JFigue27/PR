import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserFormComponent } from '../user-form/user-form-component';
import { ListController } from '../../core/ListController';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'users-component',
  templateUrl: 'users-component.html'
})
export class UsersComponent extends ListController implements OnInit {

  constructor ( public dialog:MatDialog, public userService: UserService) {
            super({ 
              service: userService,
              paginate: true,
              limit: 20,
              filterName: 'UserFilter' });

    // service: CRUDFactory;
    // paginate ?: boolean;
    // limit ?: number;
    // filters ?: string;
    // filterName ?: string;
    // sortName ?: string;
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
