import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

//COMPONENTS
import { MyApp } from './app.component';
import { LoginComponent } from '../components/login/login';
import { ListComponent } from '../components/list-component/list-component';
import { ListFormComponent } from '../components/list-form-component/list-form-component';
import { FooterComponent } from '../components/footer-component/footer-component';
import { FooterFormComponent } from '../components/footer-form-component/footer-form-component';

//PAGES
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list-page/list-page';
import { ListFormPage } from '../pages/list-form-page/list-form-page';

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
    ListFormComponent,
    FooterComponent,
    FooterFormComponent,
    //Pages
    HomePage,
    ListPage,
    ListFormPage
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
    ListFormComponent,
    FooterComponent,
    FooterFormComponent,
    //Pages
    HomePage,
    ListPage,
    ListFormPage
  ],
  providers: [
    LoginService,
    PRServiceProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UtilsServiceProvider
  ]
})
export class AppModule {}
