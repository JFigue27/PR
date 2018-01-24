import { Injectable } from '@angular/core';
import { CRUDFactory } from '../services/CRUDFactory';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PRServiceProvider extends CRUDFactory {
    
    constructor(public http: HttpClient) {
        super({ endPoint: 'PurchaseRequest'});   
        this.http = http;
    }
    
    adapterIn(oEntity: any) {
    }
      
    adapterOut(oEntity: any) {

    }
}