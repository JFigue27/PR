import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Config } from '../../services/config';
// import { Observable } from 'rxjs/Observable';

export interface IAttachment {
  FileName: string;
  Directory: string;
  isForUpload:boolean;
  toDelete: boolean;
}

@Component({
  selector: 'attachments-box-component',
  templateUrl: 'attachments-box-component.html'
})

export class AttachmentsBoxComponent implements OnChanges {
  API_URL= Config.API_URL + 'attachment';
  @Input() ownerEntity:any;
  @Input() printMode:boolean;
  @Input() kind:string;
  @Input() readonly:boolean;
  @Input() customListBind:string;
  @Input() customFolderBind:string;
  
  public uploader:FileUploader = new FileUploader({url:this.API_URL});
  // private attachmentsList: Array<IAttachment>;
  // private attachmentsFolder:string;
  // private api_name:string='api_attachments';
  
  constructor() {
    
  }
   

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes.ownerEntity.firstChange == false){
    //   this.ownerEntity[this.api_name]={};
    //   this.ownerEntity[this.api_name].uploadFiles = function():Observable<any> {
    //     if (this.uploader.getNotUploadedItems().length > 0) {
    //       this.uploader.uploadAll();
    //       // return Observable
    //     } else {
    //       return Observable.empty();
    //     }
    //   }
    // }
  }

}
