import { Observable } from 'rxjs/RX';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
import { IEntity } from './IEntity';
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

    createInstance(): Observable<any> {
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/Create', this.addAuthorization())
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

    getById(id: number): IEntity {
        return null;
    }

    getPage(limit, pageNumber, params='?') {
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/getPage/' + limit +
            '/' + pageNumber + params + '&noCache='+Number(new Date()), this.addAuthorization())
        .map(response => this.extractData(response), this)
        .catch(this.generalError);
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

    save(oEntity): Observable<any> {
        if (oEntity.id > 0) {
            return this.updateEntity(oEntity);
        } else {
            return this.createEntity(oEntity);
        }
    }

    removeEntity(userId) {
        return this.http.delete<ICommonResponse>(this.baseUrl + this.config.endPoint + "/" + userId, this.addAuthorization())
            .map(response => this.extractData(response), this)
            .catch(this.generalError);
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

    getSingleWhere(property, value ): Observable<any> {
        return this.http.get<ICommonResponse>(this.baseUrl + this.config.endPoint + '/GetSingleWhere/' + property + '/' + value
            + '?noCache=' + Number(new Date()) , this.addAuthorization())
            .map(response => this.extractData(response ), this)
            .catch(this.generalError);
    }

    abstract adapterIn(oEntity:any);

    abstract adapterOut(oEntity:any);

}