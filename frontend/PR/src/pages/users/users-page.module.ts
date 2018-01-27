import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersPage } from './users-page';

@NgModule({
  declarations: [ UsersPage ],
  imports: [ IonicPageModule.forChild(UsersPage) ],
})

export class UsersPageModule {}
