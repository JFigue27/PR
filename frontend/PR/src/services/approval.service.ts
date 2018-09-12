import { Injectable } from '@angular/core';
import { CRUDFactory } from '../core/CRUDFactory';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils-service/utils-service';
import { OidcService } from '../core/oidc.service';

@Injectable()
export class ApprovalService extends CRUDFactory {
    
    constructor(public http: HttpClient,
        private utilsService: UtilsService,
        oidc: OidcService) {
        super({ endPoint: 'Approval'}, oidc);
        this.http = http;
    }
    
    adapterIn(oEntity: any) {
        if (oEntity) {
            oEntity.ConvertedDateRequested = this.utilsService.toJsDate(oEntity.DateRequested);
            oEntity.ConvertedDateResponse = this.utilsService.toJsDate(oEntity.DateResponse);
        }
    }

    adapterOut(oEntity: any) {
        if (oEntity) {
            oEntity.DateRequested = this.utilsService.toServerDate(oEntity.ConvertedDateRequested);
            oEntity.DateResponse = this.utilsService.toServerDate(oEntity.ConvertedDateResponse);
        }
    }
}