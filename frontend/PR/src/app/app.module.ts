import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';

//ROUTING
import { AppRoutingModule } from './routes';

//COMPONENTS
import { MyApp } from './app.component';
import { HomeComponent } from '../components/home/home-component';
import { DialogComponent } from '../components/dialog/dialog-component';
import { LoginComponent } from '../components/login/login';
import { ListComponent } from '../components/list/list-component';
import { UsersComponent } from '../components/users/users-component';
import { ApprovalComponent } from '../components/approval/approval-component';
import { SuppliersComponent } from '../components/suppliers/suppliers-component';
import { AccountComponent } from '../components/account/account-component';
import { DepartmentComponent } from '../components/department/department-component';
import { PRComponent } from '../components/pr/pr-component';
import { UserFormComponent } from '../components/user-form/user-form-component';
import { SupplierFormComponent } from '../components/supplier-form/supplier-form-component';
import { DepartmentFormComponent } from '../components/department-form/department-form-component';
import { AccountFormComponent } from '../components/account-form/account-form-component';
import { ApprovalFormComponent } from '../components/approval-form/approval-form-component';
import { EmailFormComponent } from '../components/email-form/email-form-component';

//MODULES
import { AttachmentsModule } from '../components/attachments.module';
import { CommentsModule } from '../components/comments.module';


//SERVICES
import { LoginService } from '../services/login.service';
import { PRService } from '../services/pr.service';
import { UtilsService } from '../services/utils-service/utils-service';
import { UserService } from '../services/user.service';
import { SupplierService } from '../services/supplier.service';
import { DepartmentService } from '../services/department.service';
import { AccountService } from '../services/account.service';
import { ApprovalService } from '../services/approval.service';
import { CommentsService } from '../services/comments.service';
import { OidcService } from '../core/oidc.service';

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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';

//Plugins
import { NgxSpinnerModule } from 'ngx-spinner';
import { RedirectOldLinks } from './redirectOldLinks';



@NgModule({
  declarations: [
    MyApp,
    //Components
    HomeComponent,
    DialogComponent,
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
  ],
  imports: [
    AppRoutingModule,
    AttachmentsModule,
    CommentsModule,
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
    MatAutocompleteModule,
    MatProgressBarModule,
    MatSortModule,
    NgxSpinnerModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    //Component
    MyApp,
    LoginComponent,
    DialogComponent,
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
  ],
  providers: [
    LoginService,
    PRService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RedirectOldLinks,
    UtilsService,
    UserService,
    SupplierService,
    DepartmentService,
    AccountService,
    ApprovalService,
    CommentsService,
    OidcService
  ]
})
export class AppModule {}
