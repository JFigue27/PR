import { Injectable } from '@angular/core';
import { UserManager } from 'oidc-client';

@Injectable()
export class OidcService {
  private settings: any = {
    authority: 'https://apps.capsonic.com/IdentityServer',
    client_id: 'pr',
    response_type: 'id_token token',
    scope: 'openid profile email api roles',
    filterProtocolClaims: true,
    popup_redirect_uri: 'http://localhost:8100/auth_redirect.html',
    post_logout_redirect_uri: "http://localhost:8100",
    accessTokenExpiringNotificationTime: 60,
    silent_redirect_uri: 'http://localhost:8100/silent-renew.html',
    automaticSilentRenew: true,
    popupWindowFeatures: 'location=no,toolbar=no,width=500,height=600,left=100,top=100'
  };
  private loginCalled = false;
  public authentication = null;
  private manager = new UserManager(this.settings);
  private appFirstTimeLoaded = true;


  constructor() {
    this.manager.events.addUserLoaded((authResponse) => {
      this.fillAuthentication(authResponse)
      if (this.appFirstTimeLoaded) {
        this.appFirstTimeLoaded = false;
        //Broadcast on_login
      }
    });

    this.manager.events.addUserUnloaded(() => {
      this.appFirstTimeLoaded = true;
      this.removeAuthentication();
    });

    this.manager.events.addSilentRenewError((error: any) => {
      console.error('error while renewing the acces token', error);
    });

    this.manager.events.addUserSignedOut(() => {
      this.appFirstTimeLoaded = true;
      this.removeAuthentication();
    });

  }

  login() {
    if (this.loginCalled == false) {
      this.loginCalled = true;
      return this.manager
        .signinPopup()
        .then(() => {
          setTimeout(() => {
            this.loginCalled = false;
          }, 2500);
        })
        .catch((error) => {
          this.loginCalled = false;
          console.error('error while logging in through the popup', error);
          this.logout();
        });
    }
  }

  logout() {
    return this.manager
      .signoutPopup()
      .then(function() {
        this.removeAuthentication();
      })
      .catch(function(error) {
        console.error('error while signing out user', error);
      });
  }

  removeAuthentication() {
    this.authentication = null;
  }

  fillAuthentication(authResponse) {
    if (authResponse && !authResponse.expired) {
      this.authentication = authResponse;
      this.authentication.Value = authResponse.profile.preferred_username;
      this.authentication.id = authResponse.profile.sub;
      this.authentication.UserKey = authResponse.profile.sub;
      this.authentication.Email = authResponse.profile.email;
    } else {
      this.removeAuthentication();
    }
    return this.authentication;
  }

  getUser(): Promise<any> {
    return this.manager.getUser().then(oResponse => {
      // return Promise.resolve(this.fillAuthentication(oResponse));
      return this.fillAuthentication(oResponse);
    });
  }
}