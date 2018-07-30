import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersComponent } from '../components/suppliers/suppliers-component';
import { AccountComponent } from '../components/account/account-component';
import { UsersComponent } from '../components/users/users-component';
import { DepartmentComponent } from '../components/department/department-component';
import { ListComponent } from '../components/list/list-component';
import { ApprovalComponent } from '../components/approval/approval-component';
import { EmailFormComponent } from '../components/email-form/email-form-component';
import { PRComponent } from '../components/pr/pr-component';
 

const routes: Routes = [
    { path: 'suppliers', component: SuppliersComponent },
    { path: 'accounts', component: AccountComponent },
    { path: 'approvals', component: ApprovalComponent },
    { path: 'users', component: UsersComponent },
    { path: 'departments', component: DepartmentComponent },
    { path: 'pr-list', component: ListComponent },
    { path: 'profile', component: EmailFormComponent },
    { path: 'pr/:id', component: PRComponent },
    { path: '', redirectTo: 'pr-list', pathMatch: 'full' },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
