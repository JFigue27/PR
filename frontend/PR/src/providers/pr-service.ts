import { Injectable } from '@angular/core';
import { CRUDFactory } from '../services/CRUDFactory';
import { HttpClient } from '@angular/common/http';
import { UtilsServiceProvider } from './utils-service/utils-service';

@Injectable()
export class PRServiceProvider extends CRUDFactory {
    
    constructor(public http: HttpClient, private utilsService:UtilsServiceProvider) {
        super({ endPoint: 'PurchaseRequest'});   
        this.http = http;
    }
    
    adapterIn(oEntity: any) {
        if (!oEntity.PRLines){
            oEntity.PRLines = [];
        }
        
        oEntity.ConvertedDateDepartmentManager = this.utilsService.toJsDate(oEntity.DateDepartmentManager);
        oEntity.ConvertedDateGeneralManager = this.utilsService.toJsDate(oEntity.DateGeneralManager);   
    }
      
    adapterOut(oEntity: any) {
        oEntity.DateDepartmentManager = this.utilsService.toServerDate(oEntity.ConvertedDateDepartmentManager);
        oEntity.DateGeneralManager = this.utilsService.toServerDate(oEntity.ConvertedDateGeneralManager);

        if(oEntity.PRLines){
            for (let i = oEntity.PRLines.length -1; i >=0 ; i--) {
                const element = oEntity.PRLines[i];
                if(
                    element.ItemNumber ||
                    element.Description ||
                    element.UM ||
                    element.Qty ||
                    element.PriceEach ||
                    element.PriceEach2 ||
                    element.PriceEach3
                ){

                } else {
                    oEntity.PRLines.splice(i, 1);
                }
            }
        }
    }
    
}