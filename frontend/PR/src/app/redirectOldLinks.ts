import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { utils } from '../common/utils';

@Injectable()
export class RedirectOldLinks implements CanActivate {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //Your logic here, then call the navigate, your :confirmationToken should be available from the state object

        let PrKey = utils.getParameterByName('id', null);
        
        if (PrKey) {
            this.router.navigate(['pr/' + PrKey]);  
            return false;  
        }
        
        return true;
    }
}