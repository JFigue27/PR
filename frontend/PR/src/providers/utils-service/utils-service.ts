import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class UtilsServiceProvider {

  constructor(public http: HttpClient) {
  }

  toJsDate(sISO_8601: string) {
    return sISO_8601 ? moment(sISO_8601, moment.ISO_8601).toDate() : null;
  }

  toServerDate(oDate: Date) {
    let momentDate = moment(oDate);
    if (momentDate.isValid()){
        momentDate.local();
        return momentDate.format();
    }
    return null;
  }

}
