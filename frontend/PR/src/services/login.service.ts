import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/RX';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../services/config';
import { UserServiceProvider } from '../providers/user-service';


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
        let options = { headers: headers};
        return this.http.post(this.url + 'token', body, options)
        .map(this.extractData, this)
        .catch(this.handleError);
    }

    private extractData(res: Response) {
        this.userService.LoggedUser = res;

        console.log('USER ');
        console.log(this.userService.LoggedUser);
        return res;
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }
}
