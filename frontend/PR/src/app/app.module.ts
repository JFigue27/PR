import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

//COMPONENTS
import { MyApp } from './app.component';
import { LoginComponent } from '../components/login/login';
import { ListComponent } from '../components/list-component/list-component';
import { UsersComponent } from '../components/users/users-component';
import { SuppliersComponent } from '../components/suppliers-component/suppliers-component';
import { AccountComponent } from '../components/account-component/account-component';
import { DepartmentComponent } from '../components/department-component/department-component';
import { FormComponent } from '../components/form-component/form-component';
import { UserFormComponent } from '../components/user-form/user-form-component';
import { SupplierFormComponent } from '../components/supplier-form-component/supplier-form-component';
import { DepartmentFormComponent } from '../components/department-form-component/department-form-component';
import { AccountFormComponent } from '../components/account-form-component/account-form-component';

//MODULES
import { AttachmentsModule } from '../components/attachments.module';

//PAGES
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list-page/list-page';
import { FormPage } from '../pages/form-page/form-page';
import { UsersPage } from '../pages/users/users-page';
import { SuppliersPage } from '../pages/suppliers/suppliers-page';
import { AccountPage } from '../pages/account-page/account-page';
import { DepartmentPage } from '../pages/department-page/department-page';

//SERVICES
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';

//PROVIDERS
import { PRServiceProvider } from '../providers/pr-service';
import { UtilsServiceProvider } from '../providers/utils-service/utils-service';
import { UserServiceProvider } from '../providers/user-service';
import { SupplierServiceProvider } from '../providers/supplier-service';
import { DepartmentServiceProvider } from '../providers/department-service';
import { AccountServiceProvider } from '../providers/account-service';

//Angular Material components
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    MyApp,
    //Components
    LoginComponent,
    ListComponent,
    FormComponent,
    UsersComponent,
    UserFormComponent,
    SuppliersComponent,
    SupplierFormComponent,
    DepartmentComponent,
    AccountComponent,
    DepartmentFormComponent,
    AccountFormComponent,
    //Pages
    HomePage,
    ListPage,
    FormPage,
    UsersPage,
    DepartmentPage,
    AccountPage,
    SuppliersPage
  ],
  imports: [
    AttachmentsModule,
    BrowserModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    //Component
    LoginComponent,
    MyApp,
    ListComponent,
    FormComponent,
    UserFormComponent,
    UsersComponent,
    SuppliersComponent,
    SupplierFormComponent,
    DepartmentComponent,
    AccountComponent,
    DepartmentFormComponent,
    AccountFormComponent,
    //Pages
    HomePage,
    ListPage,
    FormPage,
    UsersPage,
    SuppliersPage,
    DepartmentPage,
    AccountPage
  ],
  providers: [
    LoginService,
    PRServiceProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UtilsServiceProvider,
    UserServiceProvider,
    SupplierServiceProvider,
    DepartmentServiceProvider,
    AccountServiceProvider
  ]
})
export class AppModule {}
