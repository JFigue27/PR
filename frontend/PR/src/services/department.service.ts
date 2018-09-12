import { Injectable } from '@angular/core';
import { CRUDFactory } from '../core/CRUDFactory';
import { HttpClient } from '@angular/common/http';
import { OidcService } from '../core/oidc.service';

@Injectable()
export class DepartmentService extends CRUDFactory {

    constructor(public http: HttpClient, oidc: OidcService) {
        super({ endPoint: 'Department' }, oidc);
        this.http = http;
    }

    adapterIn(oEntity: any) {
    }

    adapterOut(oEntity: any) {
        oEntity.WasAnsweredByCustomer = true;
    }
}