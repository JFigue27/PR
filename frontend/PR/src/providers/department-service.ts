import { Injectable } from '@angular/core';
import { CRUDFactory } from '../services/CRUDFactory';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DepartmentServiceProvider extends CRUDFactory {

    constructor(public http: HttpClient) {
        super({ endPoint: 'User' });
        this.http = http;
    }

    adapterIn(oEntity: any) {
        console.log('customer provider adapter in', oEntity);
    }

    adapterOut(oEntity: any) {
        oEntity.WasAnsweredByCustomer = true;
    }
}