import { NgModule } from '@angular/core';
import { AttachmentsBoxComponent } from './attachments-box-component/attachments-box-component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
	declarations: [AttachmentsBoxComponent],
	imports: [FileUploadModule],
	exports: [AttachmentsBoxComponent]
})
export class AttachmentsModule {}
