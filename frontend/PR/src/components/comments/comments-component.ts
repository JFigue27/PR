import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Config } from '../../core/config';
import { PRService } from '../../services/pr.service';
import { UserService } from '../../services/user.service';
import { CommentsService } from '../../services/comments.service';

@Component({
    selector: 'comments-component',
    templateUrl: 'comments-component.html'
})

export class CommentsComponent implements OnChanges {

    API_URL = Config.API_URL + 'attachment';
    commentsListName: string;
    private appKey:number; 
    @Input() ownerEntity: any;
    @Input() customProperty:string;
    public uploader: FileUploader;
    public currentUser:any;
    public replyText:string;
    public commentProperty:string;
    public commentToSave:string = {CommentText: ''};
    public CommentsRootKey:any;
    public theComment:Object={ Comments: [] };
    public currentCommentsRoom = 'Comments_' + this.appKey + '_' + this.CommentsRootKey;

    constructor(public PRService: PRService, public userService: UserService, public commentService: CommentsService ) {
    }

    ngOnChanges(changes: SimpleChanges): void {

        // if (this.ownerEntity && this.ownerEntity[this.commentProperty] > 0) {
        if (this.ownerEntity && this.ownerEntity.PurchaseRequestKey) {
            
            this.commentProperty = this.customProperty || "CommentKey";
            this.refreshComments();
            this.commentService.createInstance().subscribe(response =>{
                console.log(response);
                this.commentToSave = response;
            });
            this.currentUser = this.userService.LoggedUser;
            this.CommentsRootKey = this.ownerEntity[this.commentProperty];

        } else {
            this.theComment = {
                Comments: []
        };
        
        }

    }

    addComment(currentComment) {
        if (currentComment.Comments == null) {
            currentComment.Comments = [];
        }
        this.currentUser = this.userService.LoggedUser;
        this.commentToSave.id = 0;
        this.commentToSave.ParentKey = currentComment[this.commentProperty];
        this.save(this.commentToSave, this.theComment);
    }

    save(commentToSave, parentComment) {
        console.log('save')
        this.commentService.save(commentToSave).then(response => {
            console.log(response);

            parentComment.Comments.push(response);
            parentComment.IsReplying = false;
            this.commentService.createInstance().subscribe(response =>{
                this.commentToSave = response;
            });

        });
    }


    getIdenticon(theComment){
        var result = 'assets/imgs/anonymous.png';
        if (theComment && theComment.Identicon64 && theComment.Identicon64.length > 0) {
            result = 'data:image/bmp;base64,' + theComment.Identicon64;
        }
        return result;
    }

    reply(parentComment){
        if (parentComment.Comments == null) {
            parentComment.Comments = [];
        }
        this.currentUser = this.userService.LoggedUser;
        this.save({
            id: 0,
            ParentKey: parentComment.id,
            CommentText: this.replyText,
            CommentDate: new Date(),
            CommentByUser: this.currentUser.id,
            User: this.currentUser.Value,
            Identicon64: this.currentUser.Identicon64
        }, parentComment);

    }

    

    showReply(that){
        that.theComment.IsReplying = true;
    }

    refreshComments(){
        console.log('Inside refreshComments');
        this.commentService.loadEntity(this.ownerEntity[this.commentProperty]).subscribe(oResponse => {
            console.log('2018');
            console.log(oResponse);
            console.log(oResponse.Result);
            this.theComment = oResponse.Result;
        });
    };
}
        //         this.theComment = { Comments: [
        // {
        //             "ParentKey": 23439,
        //                 "CommentText": "Buenas tardes este es el primer comentario que existe actualmente con el nuevo sistema",
        //                     "CommentDate": "2018-05-21T16:08:32",
        //                         "CommentByUser": 60,
        //                             "Comments": [
        //                                 {
        //                                     "ParentKey": 54436,
        //                                     "CommentText": "hello",
        //                                     "CommentDate": "2018-05-21T16:08:49",
        //                                     "CommentByUser": 2,
        //                                     "Comments": [
        //                                         {
        //                                             "ParentKey": 54437,
        //                                             "CommentText": "Otro reply",
        //                                             "CommentDate": "2018-05-22T13:22:01",
        //                                             "CommentByUser": 2,
        //                                             "Comments": [],
        //                                             "User": "Alfredo Pacheco",
        //                                             "Identicon64": "",
        //                                             "id": 54457,
        //                                             "AAA_EntityName": "Comment"
        //                                         }],
        //                                     "User": "Alfredo Pacheco",
        //                                     "Identicon64": "",
        //                                     "id": 54437,
        //                                     "AAA_EntityName": "Comment"
        //                                 }],
        //                                 "User": "Erick Holguin",
        //                                     "Identicon64": "",
        //                                         "id": 54436,
        //                                             "AAA_EntityName": "Comment"
        //         },
        //         {
        //             "ParentKey": 23439,
        //                 "CommentText": "Este es el segundo comentario hecho por el usuario segundo que contesto la peticion",
        //                     "CommentDate": "2018-05-21T16:08:59",
        //                         "CommentByUser": 2,
        //                             "Comments": [
        //                                 {
        //                                     "ParentKey": 54438,
        //                                     "CommentText": "Hi",
        //                                     "CommentDate": "2018-05-21T16:09:22",
        //                                     "CommentByUser": 60,
        //                                     "Comments": [],
        //                                     "User": "Erick Holguin",
        //                                     "Identicon64": "",
        //                                     "id": 54439,
        //                                     "AAA_EntityName": "Comment"
        //                                 }],
        //                                 "User": "Alfredo Pacheco",
        //                                     "Identicon64": "",
        //                                         "id": 54438,
        //                                             "AAA_EntityName": "Comment"
        //         }]
        //         }
