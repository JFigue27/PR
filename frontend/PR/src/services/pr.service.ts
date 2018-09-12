import { Injectable } from '@angular/core';
import { CRUDFactory } from '../core/CRUDFactory';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils-service/utils-service';
import { OidcService } from '../core/oidc.service';

@Injectable()
export class PRService extends CRUDFactory {
    
    constructor(public http: HttpClient,
        private utilsService:UtilsService,
        oidc: OidcService) {
        super({ endPoint: 'PurchaseRequest'}, oidc);
        this.http = http;
    }


    adapterIn(oEntity: any) {
        if (!oEntity.PRLines){
            oEntity.PRLines = [];
        }
        
        oEntity.ConvertedDateDepartmentManager = this.utilsService.toJsDate(oEntity.DateDepartmentManager);
        oEntity.ConvertedDateGeneralManager = this.utilsService.toJsDate(oEntity.DateGeneralManager);
        oEntity.ConvertedDateInvoice = this.utilsService.toJsDate(oEntity.DateInvoice);   
    }
      
    adapterOut(oEntity: any) {
        oEntity.DateDepartmentManager = this.utilsService.toServerDate(oEntity.ConvertedDateDepartmentManager);
        oEntity.DateGeneralManager = this.utilsService.toServerDate(oEntity.ConvertedDateGeneralManager);
        oEntity.DateInvoice = this.utilsService.toServerDate(oEntity.ConvertedDateInvoice);

        if(oEntity.PRLines){
            for (let i = oEntity.PRLines.length -1; i >=0 ; i--) {
                const element = oEntity.PRLines[i];
                if( element.ItemNumber || element.Description || element.UM || element.Qty 
                    || element.PriceEach || element.PriceEach2 || element.PriceEach3 ){
                    }
                else {
                    oEntity.PRLines.splice(i, 1);
                }
            }
        }
    }
}