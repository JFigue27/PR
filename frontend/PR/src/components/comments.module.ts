import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CommentsComponent } from './comments/comments-component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [CommentsComponent],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        IonicModule.forRoot(CommentsComponent)
    ],
    bootstrap: [IonicApp],
    exports: [CommentsComponent],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class CommentsModule { }
