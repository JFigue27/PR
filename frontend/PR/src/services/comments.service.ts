import { Injectable } from '@angular/core';
import { CRUDFactory } from '../core/CRUDFactory';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommentsService extends CRUDFactory {
    

    constructor(public http: HttpClient) {
        super({ endPoint: 'Comment' });
        this.http = http;
    }

    adapterIn(oEntity: any) {
    }

    adapterOut(oEntity: any) {
    }

}