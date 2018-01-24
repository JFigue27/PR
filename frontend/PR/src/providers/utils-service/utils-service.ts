import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UtilsServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UtilsServiceProvider Provider');
  }

}
