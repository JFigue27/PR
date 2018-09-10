import { Injectable } from '@angular/core';
import { CRUDFactory } from '../core/CRUDFactory';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService extends CRUDFactory {
    public LoggedUser: any;

    constructor(public http: HttpClient) {
        super({ endPoint: 'User'});   
        this.http = http;
    }
    
    adapterIn(oEntity: any) {
    }
      
    adapterOut(oEntity: any) {
        oEntity.WasAnsweredByCustomer = true;
    }

    SendTestEmail(oEntity: any): Promise<any> {
        return this.customPost('SendTestEmail', oEntity);
    }

}