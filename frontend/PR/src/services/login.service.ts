import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/RX';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../services/config';


@Injectable()
export class LoginService {
    url = Config.API_URL;

    constructor(private http: HttpClient) {
    }

    getToken(body): Observable<any> {
        let headers = new HttpHeaders(); 
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = { headers: headers};
        return this.http.post(this.url + 'token', body, options).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res;
        // console.log(body);
        return body;
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }
}
