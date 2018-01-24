import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CRUDFactory } from '../../services/CRUDFactory';

@Injectable()
export class PrlineServiceProvider extends CRUDFactory {

  constructor(public http: HttpClient) {
    super({ endPoint: 'PrLine'});   
    this.http = http;
}

adapterIn(oEntity: any) {
}
  
adapterOut(oEntity: any) {
}
}
