import { Observable } from 'rxjs/RX';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
import { OidcService } from './oidc.service';
import alertify from 'alertifyjs';

export interface IConfig {
    endPoint: string;
}

export interface ICommonResponse {
    ErrorThrown: boolean;
    ResponseDescription: string;
    Result: any;
    AdditionalData: any;
    ErrorType: any;
}

export abstract class CRUDFactory {
    baseUrl: string = Config.API_URL;
    protected http: HttpClient;
    public arrAllRecords: Array<any> = [];
    public catalogs;
    constructor(private config: IConfig, private oidc: OidcService) {
    }

    addAuthorization() {
        let headers: HttpHeaders = new HttpHeaders();
        // let user = JSON.parse(localStorage.getItem('user')) || {};
        let user = this.oidc.authentication;
        if (user) {
            headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers = headers.append('Authorization', 'bearer ' + user.access_token);
            return { headers: headers };
        } else {
            this.oidc.login();
        }
    }

    createEntity(oEntity): Promise<any> {
        this.adapterOut(oEntity);
        return this.http.post<ICommonResponse>(this.baseUrl + this.config.endPoint, '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .map(response => this.extractData(response), this)
            .map(o => o.Result)
            .catch(this.generalError)
            .toPromise();
    }

    createInstance(oEntity = null): Promise<any> {
        return this.http.post<ICommonResponse>(this.baseUrl + this.config.endPoint + '/Create', '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .toPromise()
            .then(response => this.extractData(response))
            .then(d => d.Result)
            .catch(this.generalError);
    }

    customGet(customMethod: string): Promise<any> {
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/' + customMethod, this.addAuthorization())
            .toPromise()
            .then(response => this.extractData(response))
            .then(d => d.Result)
            .catch(this.generalError);
    }

    customPost(customMethod: string, oEntity: any = null): Promise<any> {
        return this.http.post<ICommonResponse>(this.baseUrl + this.config.endPoint + '/' + customMethod, '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .toPromise()
            .then(response => this.extractData(response))
            .then(d => d.Result)
            .catch(this.generalError);
    }

    getPage(limit, pageNumber, params = '?'): Promise<any> {
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/getPage/' + limit +
            '/' + pageNumber + params + '&noCache=' + Number(new Date()), this.addAuthorization()).toPromise()
            .then(response => this.extractData(response))
            .catch(this.generalError);
    }

    getSingleWhere(property, value): Promise<any> {
        if (property && value) {
            return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/GetSingleWhere/' + property + '/' + value
                + '?noCache=' + Number(new Date()), this.addAuthorization())
                .map(response => this.extractData(response), this)
                .catch(this.generalError)
                .toPromise();
        } else {
            return Promise.resolve({});
        }
    }

    loadEntities(params?): Promise<any> {
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint, this.addAuthorization()).toPromise()
            .then(response => this.extractData(response))
            .catch(this.generalError);
    }

    loadEntity(id): Promise<any> {
        if (id) {
            return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/' + id, this.addAuthorization())
                .toPromise()
                .then(response => this.extractData(response))
                .catch(this.generalError);
        } else {
            return Promise.reject('Id not found');
        }
    }

    remove(): Promise<any> {
        return Promise.reject('not implemented');
    }

    removeEntity(id): Promise<any> {
        return this.http.delete<ICommonResponse>(this.baseUrl + this.config.endPoint + "/" + id, this.addAuthorization())
            .toPromise()
            .then(response => this.extractData(response))
            .catch(this.generalError);
    }

    save(oEntity): Promise<any> {
        if (oEntity.id > 0) {
            console.log('update')
            return this.updateEntity(oEntity);
        } else {
            console.log('create')
            return this.createEntity(oEntity);
        }
    }

    SendTestEmail(oEntity): Promise<any> {
        console.log('2018 send test email');
        console.log(this.baseUrl + this.config.endPoint + 'SendTestEmail');
        return this.http.post<ICommonResponse>(this.baseUrl + this.config.endPoint + '/SendTestEmail', '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .toPromise()
            .then(response => this.extractData(response))
            .then(d => d.Result)
            .catch(this.generalError);
    }

    setProperty(oEntity, sProperty, Value, qParams) {
    }

    updateEntity(oEntity) {
        this.adapterOut(oEntity);
        return this.http.put<ICommonResponse>(this.baseUrl + this.config.endPoint + '/' + oEntity.id, '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .map(response => this.extractData(response), this)
            .map(o => o.Result)
            .catch(this.generalError)
            .toPromise();
    }

    extractData(res: ICommonResponse): ICommonResponse {
        const backendResponse: ICommonResponse = res;
        console.log(backendResponse);
        if (backendResponse.ErrorThrown) {
            throw backendResponse;
        }
        //all incoming responses go through adapterIn hook
        if (Array.isArray(backendResponse.Result)) {
            backendResponse.Result.forEach(oEntity => this.adapterIn(oEntity))
        } else if (typeof (backendResponse.Result) === 'object') {
            this.adapterIn(backendResponse.Result)
        }
        return backendResponse;
    }

    generalError(error: any): Promise<any> {
        if (error.ErrorThrown) {
            switch (error.ErrorType) {
                case "MESSAGE":
                    alertify.alert(error.ResponseDescription);
            }
            return Promise.resolve();
        } else {
            switch (error.status) {
                case 401:
                    //TODO: Open Login Form.
                    if (this && this.oidc) {
                        this.oidc.login();
                    }
                    return Promise.reject('Your session has expired. Log in again');
            }
        }
        return Promise.reject(error.statusText);
    }

    // LOCAL OPERATIONS
    getById(id) {
        for (let i = 0; i < this.arrAllRecords.length; i++) {
            if (id == this.arrAllRecords[i].id) {
                return 0;
            }
            return null;
        }
    }

    getAll() {
        for (let i = 0; i < this.arrAllRecords.length; i++) {
            this.arrAllRecords[i] = this.arrAllRecords[i];
        }
        return this.arrAllRecords;
    }

    getRecursiveBySeedId() {

    }

    getRawAll() {
        return this.arrAllRecords;
    }

    setRawAll(arr: any) {
        this.arrAllRecords = arr;
    }

    populateCatalogValues(oEntity) {
        for (let catalog in this.catalogs) {
            if (this.catalogs.hasOwnProperty(catalog)) {
                oEntity['' + catalog] = this.catalogs[catalog].getById(oEntity['' + catalog + 'Key']);
            }

        }
    }


    abstract adapterIn(oEntity: any);

    abstract adapterOut(oEntity: any);

}