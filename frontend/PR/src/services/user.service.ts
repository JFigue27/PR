import { Injectable } from '@angular/core';
import { CRUDFactory } from '../core/CRUDFactory';
import { HttpClient } from '@angular/common/http';
import { OidcService } from '../core/oidc.service';

@Injectable()
export class UserService extends CRUDFactory {
    public LoggedUser: any = {};

    constructor(public http: HttpClient, oidc: OidcService) {
        super({ endPoint: 'User'}, oidc);
        this.http = http;
    }
    
    adapterIn(oEntity: any) {
    }
      
    adapterOut(oEntity: any) {
        oEntity.WasAnsweredByCustomer = true;
    }

    SendTestEmail(oEntity: any): Promise<any> {
        return this.customPost('SendTestEmail', oEntity);
    }

    getByUserName(userName: string) {
        return this.customGet('getByUserName/' + userName);
    }

}