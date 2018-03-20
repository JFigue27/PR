import { ErrorHandler, NgModule } from '@angular/core';
import { AttachmentsBoxComponent } from './attachments-box-component/attachments-box-component';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [AttachmentsBoxComponent],
	imports: [
		FileUploadModule,
		CommonModule,
		IonicModule.forRoot(AttachmentsBoxComponent)
	],
	bootstrap: [IonicApp],
	exports: [AttachmentsBoxComponent],
	providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AttachmentsModule {}
