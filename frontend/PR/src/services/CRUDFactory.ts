import { Observable } from 'rxjs/RX';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
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
    public arrAllRecords:Array<any>=[];
    public catalogs;
    constructor(private config: IConfig) {
    }

    addAuthorization() {
        let headers: HttpHeaders = new HttpHeaders();
        let user = JSON.parse(localStorage.getItem('user')) || {};

        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers = headers.append('Authorization', 'bearer ' + user.access_token);
        return { headers: headers };
    }

    createEntity(oEntity) {
        this.adapterOut(oEntity);
        return this.http.post<ICommonResponse>(this.baseUrl + this.config.endPoint, '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .map(response => this.extractData(response), this)
            .map(o => o.Result)
            .catch(this.generalError);
    }

    createInstance(oEntity = null): Observable<any> {
        return this.http.post<ICommonResponse>(this.baseUrl + this.config.endPoint + '/Create', '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .map(response => this.extractData(response), this)
            .map(d => d.Result)
            .catch(this.generalError);
    }

    customGet(customMethod: string): Observable<any>{
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/' + customMethod, this.addAuthorization())
            .map(response => this.extractData(response), this)
            .map(d => d.Result)
            .catch(this.generalError);
    }

    customPost(customMethod: string, oEntity: any = null): Observable<any> {
        return this.http.post<ICommonResponse>(this.baseUrl + this.config.endPoint + '/' + customMethod,  '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .map(response => this.extractData(response), this)
            .map(d => d.Result)
            .catch(this.generalError);
    }
    
    getPage(limit, pageNumber, params='?') {
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/getPage/' + limit +
            '/' + pageNumber + params + '&noCache='+Number(new Date()), this.addAuthorization())
        .map(response => this.extractData(response), this)
        .catch(this.generalError);
    }

    getSingleWhere(property, value): Observable<any> {
        if (property && value) {
            return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/GetSingleWhere/' + property + '/' + value
                + '?noCache=' + Number(new Date()), this.addAuthorization())
                .map(response => this.extractData(response), this)
                .catch(this.generalError);
        } else {
            return Observable.empty();
        }
    }

    loadEntities(params?) { 
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint, this.addAuthorization())
        .map(response => this.extractData(response), this)
        .catch(this.generalError);
    }

    loadEntity(id) {
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/' + id, this.addAuthorization())
            .map(response => this.extractData(response), this)
            .catch(this.generalError);
    }

    remove(): Observable<any> {
        return Observable.empty();
    }

    removeEntity(userId) {
        return this.http.delete<ICommonResponse>(this.baseUrl + this.config.endPoint + "/" + userId, this.addAuthorization())
            .map(response => this.extractData(response), this)
            .catch(this.generalError);
    }

    save(oEntity): Observable<any> {
        if (oEntity.id > 0) {
            return this.updateEntity(oEntity);
        } else {
            return this.createEntity(oEntity);
        }
    }

    SendTestEmail(oEntity): Observable<any> {
        console.log('2018 send test email');
        console.log(this.baseUrl + this.config.endPoint + 'SendTestEmail');
        return this.http.post<ICommonResponse>(this.baseUrl + this.config.endPoint + '/SendTestEmail', '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .map(response => this.extractData(response), this)
            .map(d => d.Result)
            .catch(this.generalError);
    }

    setProperty(oEntity, sProperty, Value, qParams) {
    }
    
    updateEntity(oEntity) {
        this.adapterOut(oEntity);
        return this.http.put<ICommonResponse>(this.baseUrl + this.config.endPoint + '/' + oEntity.id, '=' + encodeURIComponent(JSON.stringify(oEntity)), this.addAuthorization())
            .map(response => this.extractData(response), this)
            .map(o => o.Result)
            .catch(this.generalError);
    }

    extractData(res: ICommonResponse): ICommonResponse {
        const backendResponse: ICommonResponse = res;
        console.log(backendResponse);
        if (backendResponse.ErrorThrown) {
            throw backendResponse;
        }
        //all incoming responses go through adapterIn hook
        if( Array.isArray(backendResponse.Result )) {
            backendResponse.Result.forEach( oEntity => this.adapterIn(oEntity))
        } else {
            this.adapterIn(backendResponse.Result) 
        }
        return backendResponse;
    }

    generalError(error: any) {
        if (error.ErrorThrown) {
            switch (error.ErrorType) {
                case "MESSAGE":
                    alertify.alert(error.ResponseDescription);
            }
            return Observable.empty();
        } else {
            switch (error.status) {
                case 401:
                    //TODO: Open Login Form.
                    return Observable.empty();
            }
        }
        return Observable.throw(error.statusText);
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

    getRecursiveBySeedId(){

    }

    getRawAll() {
        return this.arrAllRecords;
    }

    setRawAll(arr:any) {
        this.arrAllRecords = arr;
    }

    populateCatalogValues(oEntity) {
        for (let catalog in this.catalogs) {
            if (this.catalogs.hasOwnProperty(catalog)) {
                oEntity[''+ catalog] = this.catalogs[catalog].getById(oEntity['' + catalog + 'Key']);
            }
            
        }
    }


    abstract adapterIn(oEntity:any);

    abstract adapterOut(oEntity:any);

}