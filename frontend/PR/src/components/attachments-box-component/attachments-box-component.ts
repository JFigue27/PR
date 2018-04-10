import { Component, Input, OnChanges, SimpleChanges,ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Config } from '../../services/config';
import { PRServiceProvider } from '../../providers/pr-service';
import alertify from 'alertifyjs';

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
  attachmentsListName: string;
  attachmentsFolder: string;
  api_name: string = 'api_attachments';
  test:boolean=true;
  uploadingPromise: any;
  uploadingPromiseResolve: any;
  uploadingPromiseReject: any;
  ErrorThrown: boolean;
  @Input() ownerEntity: any;
  @Input() printMode: boolean;
  @Input() kind: string;
  @Input() readonly: boolean;
  @Input() customListBind: string;
  @Input() customFolderBind: string;
  public uploader: FileUploader;
  
  constructor (
    public PRService: PRServiceProvider,
    public element: ElementRef
  ) { 
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ownerEntity && changes.ownerEntity.currentValue && changes.ownerEntity.currentValue.AAA_EntityName) {

      //Variables Initialization
      let self = this;
      this.ownerEntity[this.api_name] = {};
      this.attachmentsListName = this.customListBind || 'Attachments';
      this.attachmentsFolder = this.customFolderBind || 'AttachmentsFolder';
      this.uploader = new FileUploader({ url: this.API_URL });
      
      //TODO handle customListBind
      this.ownerEntity[this.api_name].uploadFiles = () => {
        this.uploadingPromise = new Promise((resolve, reject) => {
          this.uploadingPromiseResolve = resolve;
          this.uploadingPromiseReject = reject;
          this.ErrorThrown = false;
          if (this.uploader.getNotUploadedItems().length > 0) {
            this.uploader.uploadAll();
          } else {
            resolve();
          }
        });
        return this.uploadingPromise;
      }
      
      this.ownerEntity[this.api_name].clearQueue = () => {
        this.uploader.clearQueue();
      }
      
      //Callbacks
      this.uploader.onAfterAddingFile = function(fileItem) {
        if(!self.ownerEntity[self.attachmentsListName]){
          self.ownerEntity[self.attachmentsListName] = [];
        }
        self.ownerEntity[self.attachmentsListName].push({
          FileName: fileItem.file.name,
          Directory: (self.ownerEntity[self.attachmentsFolder] || ''),
          isForUpload: true
        });
        self.ownerEntity.editMode = true;
      }
 
      this.uploader.onSuccessItem = (item, response:any, status, headers) => {
        var backendResponse = JSON.parse(response);
        if (!backendResponse.ErrorThrown) {
          this.ownerEntity[this.attachmentsFolder] = backendResponse.ResponseDescription;
          let theAttachment = this.getAttachment(item.file.name);
          theAttachment.isForUpload = false;
        } else {
          this.ErrorThrown = true;
          alertify.alert(backendResponse.responseDescription).set('modal', true);
        }
      }

      //Resolves promise only if all files were uploader succesfully
      this.uploader.onCompleteAll = () => {
        if (!this.ErrorThrown) {
          this.uploadingPromiseResolve();
        } else {
          this.uploadingPromiseReject();
        }
      }

      this.uploader.onBeforeUploadItem = (item) =>{
        item.withCredentials = false;
        item.url = this.API_URL + '?attachmentKind=' + (this.kind || '') + '&targetFolder=' + (this.ownerEntity[this.attachmentsFolder] || '');
      }
    }
  }

  onUploaderResponse() {
  }

  initializeApi() {
  }

  cancelRemove(index) {
    this.ownerEntity[this.attachmentsListName][index].ToDelete = false;
  }
 
  getAttachment(sName) {
    return this.ownerEntity[this.attachmentsListName].find(d => d.FileName == sName);
  }
  
  getEncodedFileName(attachment) {
    return encodeURIComponent(attachment.FileName);
  }
  
  getItem(sName) {
    return this.uploader.queue.find(d => d.file.name == sName);
  }

  openFileBrowser(){
    if (!this.readonly) {
      let file = document.getElementById('file');
      file.click();
    }
  }
  // User clicks X on selected file
  removeAttachment(attachment, index) {
    if (attachment.isForUpload) {
      this.uploader.removeFromQueue(this.getItem(attachment.FileName));
      this.ownerEntity[this.attachmentsListName].splice(index,1);
    } else {
      this.ownerEntity[this.attachmentsListName][index].ToDelete = true;
    }
  }
  
  getToDeleteStyle(index) {
    if (this.ownerEntity[this.attachmentsListName][index].ToDelete == true) {
      return 'to-delete';
    }
  }

  getCloseStyle(index) {
    if (this.ownerEntity[this.attachmentsListName][index].ToDelete == true) {
      return 'hide-close';
    } else {
      return 'show-close';
    }
  }

  getCancelRemoveStyle(index) {
    if (this.ownerEntity[this.attachmentsListName][index].ToDelete == true) {
      return 'show-close-text';
    } else {
      return 'hide-close-text';
    }
  }
}
