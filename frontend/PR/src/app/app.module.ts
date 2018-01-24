import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

//COMPONENTS
import { MyApp } from './app.component';
import { LoginComponent } from '../components/login/login';
import { ListComponent } from '../components/list-component/list-component';
import { FormComponent } from '../components/form-component/form-component';
import { AttachmentsBoxComponent } from '../components/attachments-box-component/attachments-box-component';


//PAGES
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list-page/list-page';
import { FormPage } from '../pages/form-page/form-page';

//SERVICES
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';

//PROVIDERS
import { PRServiceProvider } from '../providers/pr-service';
import { UtilsServiceProvider } from '../providers/utils-service/utils-service';

//Angular Material components
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    MyApp,
    //Components
    LoginComponent,
    ListComponent,
    FormComponent,
    AttachmentsBoxComponent,
    //Pages
    HomePage,
    ListPage,
    FormPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
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
    AttachmentsBoxComponent,
    //Pages
    HomePage,
    ListPage,
    FormPage
  ],
  providers: [
    LoginService,
    PRServiceProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UtilsServiceProvider
  ]
})
export class AppModule {}
