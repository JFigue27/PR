import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';

//COMPONENTS
import { MyApp } from './app.component';
import { LoginComponent } from '../components/login/login';
import { ListComponent } from '../components/list-component/list-component';
import { UsersComponent } from '../components/users/users-component';
import { ApprovalComponent } from '../components/approval-component/approval-component';
import { SuppliersComponent } from '../components/suppliers-component/suppliers-component';
import { AccountComponent } from '../components/account-component/account-component';
import { DepartmentComponent } from '../components/department-component/department-component';
import { PRComponent } from '../components/pr-component/pr-component';
import { UserFormComponent } from '../components/user-form/user-form-component';
import { SupplierFormComponent } from '../components/supplier-form-component/supplier-form-component';
import { DepartmentFormComponent } from '../components/department-form-component/department-form-component';
import { AccountFormComponent } from '../components/account-form-component/account-form-component';
import { ApprovalFormComponent } from '../components/approval-form-component/approval-form-component';
import { EmailFormComponent } from '../components/email-form-component/email-form-component';
import { confirmComponent } from '../components/confirm-component/confirm-component';
import { FinderComponent } from '../components/finder/finder-component';

//MODULES
import { AttachmentsModule } from '../components/attachments.module';

//PAGES
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list-page/list-page';
import { PRPage } from '../pages/pr-page/pr-page';
import { UsersPage } from '../pages/users/users-page';
import { SuppliersPage } from '../pages/suppliers/suppliers-page';
import { AccountPage } from '../pages/account-page/account-page';
import { DepartmentPage } from '../pages/department-page/department-page';
import { ApprovalPage } from '../pages/approval-page/approval-page';
import { EmailPage } from '../pages/email-page/email-page';

//SERVICES
import { LoginService } from '../services/login.service';

//PROVIDERS
import { PRServiceProvider } from '../providers/pr-service';
import { UtilsServiceProvider } from '../providers/utils-service/utils-service';
import { UserServiceProvider } from '../providers/user-service';
import { SupplierServiceProvider } from '../providers/supplier-service';
import { DepartmentServiceProvider } from '../providers/department-service';
import { AccountServiceProvider } from '../providers/account-service';
import { ApprovalServiceProvider } from '../providers/approval-service';

//Angular Material components
import { MatNativeDateModule, MatDatepickerModule, MatRadioModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    MyApp,
    //Components
    LoginComponent,
    ListComponent,
    PRComponent,
    UsersComponent,
    UserFormComponent,
    SuppliersComponent,
    SupplierFormComponent,
    DepartmentComponent,
    AccountComponent,
    DepartmentFormComponent,
    AccountFormComponent,
    ApprovalComponent,
    ApprovalFormComponent,
    EmailFormComponent,
    confirmComponent,
    FinderComponent,
    //Pages
    HomePage,
    ListPage,
    PRPage,
    UsersPage,
    DepartmentPage,
    AccountPage,
    SuppliersPage,
    ApprovalPage,
    EmailPage,
  ],
  imports: [
    AttachmentsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    FileUploadModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatRadioModule,
    MatTabsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    //Component
    LoginComponent,
    MyApp,
    ListComponent,
    PRComponent,
    UserFormComponent,
    UsersComponent,
    SuppliersComponent,
    SupplierFormComponent,
    DepartmentComponent,
    AccountComponent,
    DepartmentFormComponent,
    AccountFormComponent,
    ApprovalComponent,
    ApprovalFormComponent,
    EmailFormComponent,
    confirmComponent,
    //Pages
    HomePage,
    ListPage,
    PRPage,
    UsersPage,
    SuppliersPage,
    DepartmentPage,
    AccountPage,
    ApprovalPage,
    EmailPage
  ],
  providers: [
    LoginService,
    PRServiceProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UtilsServiceProvider,
    UserServiceProvider,
    SupplierServiceProvider,
    DepartmentServiceProvider,
    AccountServiceProvider,
    ApprovalServiceProvider
  ]
})
export class AppModule {}
