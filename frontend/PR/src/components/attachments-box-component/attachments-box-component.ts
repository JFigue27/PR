import { Component, Input, OnChanges, SimpleChanges, OnInit, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Config } from '../../services/config';
import { FormController } from '../../services/FormController';
import { PRServiceProvider } from '../../providers/pr-service';
import alertify from 'alertifyjs';
// import { Observable } from 'rxjs/Observable';

export interface IAttachment {
  FileName: string;
  Directory: string;
  isForUpload: boolean;
  toDelete: boolean;
}

@Component({
  selector: 'attachments-box-component',
  templateUrl: 'attachments-box-component.html'
})

export class AttachmentsBoxComponent implements OnChanges {

  API_URL = Config.API_URL + 'attachment';
  @Input() ownerEntity: any;
  @Input() printMode: boolean;
  @Input() kind: string;
  @Input() readonly: boolean;
  @Input() customListBind: string;
  @Input() customFolderBind: string;

  private uploader: FileUploader = new FileUploader(
    { url: this.API_URL }
  );
  private attachmentsListName: string;
  private attachmentsFolder: string;
  private api_name: string = 'api_attachments';
  private uploadingPromise: any;
  private ErrorThrown: boolean;

  constructor(
    public PRService: PRServiceProvider,
    public element: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ownerEntity.firstChange == false) {
      
      //Variables Initialization
      this.attachmentsListName = this.customListBind || 'Attachments';
      this.attachmentsFolder = this.customFolderBind || 'AttachmentsFolder';

      
      //Public accesors
      this.ownerEntity[this.api_name] = {};
      
      //TODO handle customListBind
      this.ownerEntity[this.api_name].uploadFiles = function () {
        this.uploadingPromise = new Promise(function (resolve, reject) {
          this.ErrorThrown = false;
          if (this.uploader.getNotUploadedItems().length > 0) {
            this.uploader.uploadAll();
          } else {
            resolve();
          }
        });
      }
      
      this.ownerEntity[this.api_name].clearQeue = function() {
        this.uploader.clearQeue();
      }
      
      //Callbacks
      this.uploader.onAfterAddingFile = function(fileItem){

      }

      // A single file was uploaded succesfully
      this.uploader.onSuccessItem = function (item, response:any, status, headers) {

        if(!response.ErrorThrown){
          this.ownerEntity[this.attachmentsFolder] = response.ResponseDescription;
          let theAttachment = this.getAttachment(item.file.name);
          theAttachment.isForUpload = false;
        } else {
          this.ErrorThrown = true;
          alertify.alert(response.responseDescription).set('modal', true);
        }
      }

      //Resolves promise only if all files were uploader succesfully
      this.uploader.onCompleteAll = function(){
        if (!this.ErrorThrown) {
          this.uploadingPromise.resolve();
        } else {
          this.uploadingPromise.reject();
        }
      }

      this.uploader.onBeforeUploadItem = function(item){
        item.url = this.API_URL + 'attachment?attachmentKind=' + (this.kind || '') + '&targetFolder=' + (this.ownerEntity[this.attachmentsFolder] || '')
      }

    }
  }
  
  cancelRemove(index) {
    this.ownerEntity[this.attachmentsListName][index].ToDelete = false;
  }

  openFileBrowser() {
    // get
  }

  
  getAttachment(sName){
    return this.ownerEntity[this.attachmentsListName].find(d => d.FileName == sName);
  }
  
  getEncodedFileName(attachment) {
    return encodeURIComponent(attachment.FileName);
  }
  
  getItem(sName){
    return this.uploader.queue.find(d => d.file.name == sName);
  }
  
  removeAttachment(attachment, index){
    if (attachment.isForUpload) {
      this.uploader.removeFromQueue(this.getItem(attachment.FileName));
      this.ownerEntity[this.attachmentsListName].splice(index,1);
    } else {
      this.ownerEntity[this.attachmentsListName][index].ToDelete = true;
    }
  }

}
