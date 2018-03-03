import { Injectable } from '@angular/core';
import { CRUDFactory } from '../services/CRUDFactory';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserServiceProvider extends CRUDFactory {
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

    SendTestEmail(oEntity: any): Observable<any> {
        return this.customPost('SendTestEmail', oEntity);
    }

}