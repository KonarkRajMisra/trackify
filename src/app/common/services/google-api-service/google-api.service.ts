import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { Customer } from '../../models/customer';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '48301263695-3je8eommj5iqskcfv49q1fqdkekvke4f.apps.googleusercontent.com',
  scope: 'openid profile email'
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  customerProfileSubject = new Subject<Customer>();

  constructor(private readonly oAuthService: OAuthService) { 
    oAuthService.configure(oAuthConfig);
    oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout'
    oAuthService.loadDiscoveryDocument().then( () => {
      oAuthService.tryLoginImplicitFlow().then( () => {
        if(!oAuthService.hasValidAccessToken()){
          oAuthService.initLoginFlow()
        }else {
          oAuthService.loadUserProfile().then( (customerProfile) => {
            this.customerProfileSubject.next(customerProfile as Customer)
          })
        }
      })
    })
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signOut() {
    this.oAuthService.logOut()
  }

  getAuthorizationHeader() {
    return this.oAuthService.authorizationHeader();
  }

  getIdToken() {
    return this.oAuthService.getIdToken();
  }
}
