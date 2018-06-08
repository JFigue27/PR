import { Injectable } from '@angular/core';
import { CRUDFactory } from '../core/CRUDFactory';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DepartmentService extends CRUDFactory {

    constructor(public http: HttpClient) {
        super({ endPoint: 'Department' });
        this.http = http;
    }

    adapterIn(oEntity: any) {
    }

    adapterOut(oEntity: any) {
        oEntity.WasAnsweredByCustomer = true;
    }
}