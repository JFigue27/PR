import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../services/config';
import { UserServiceProvider } from '../providers/user-service';


@Injectable()
export class LoginService {
    url = Config.API_URL;

    constructor(
        private http: HttpClient,
        private userService: UserServiceProvider
    ) {

    }

    getToken(body): Promise<any> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = { headers: headers };
        let self = this
        return new Promise(function (resolve, reject) {
            self.http.post(self.url + 'token', body, options).toPromise()
                .then(r => {
                    self.userService.LoggedUser = r;
                    localStorage.setItem('user', JSON.stringify(r));
                    resolve();
                })
                .catch(r => {
                    let sResponseError = self.handleError(r);
                    reject(sResponseError);
                });
        });
    }

    private handleError(ResponseError: any) {
        if (ResponseError && ResponseError.error && ResponseError.error.error_description) {
            return ResponseError.error.error_description;
        }
        return "An error has occured";
    }
}
