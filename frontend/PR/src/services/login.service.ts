import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/RX';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Config } from '../services/config';
import { UserServiceProvider } from '../providers/user-service';
import alertify from 'alertifyjs';


@Injectable()
export class LoginService {
    url = Config.API_URL;

    constructor(
        private http: HttpClient,
        private userService:UserServiceProvider
    ) {
    
    }

    getToken(body): Observable<any> {
        let headers = new HttpHeaders(); 
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = { headers: headers };
        return this.http.post(this.url + 'token', body, options)
        .map(this.extractData, this)
        .catch(this.handleError);
    }

    private extractData(res: Response) {
        console.log('2017');
        console.log(res);
        return res; 
    }

    private handleError(ResponseError: HttpResponse<any>) { 
        console.log('2018');
        console.log(ResponseError);
        console.log('22');
        // console.log(ResponseError.error.error_description );
        // alertify.alert(error.body.error.error_description);
        return Observable.throw(ResponseError);
        
        // return Observable.throw(error.statusText);
    }
}
