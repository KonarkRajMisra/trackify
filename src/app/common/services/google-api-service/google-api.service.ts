import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { UserInfo } from '../../models/user-info';

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

  userProfileSubject = new Subject<UserInfo>();

  constructor(private readonly oAuthService: OAuthService) { 
    oAuthService.configure(oAuthConfig);
    oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout'
    oAuthService.loadDiscoveryDocument().then( () => {
      oAuthService.tryLoginImplicitFlow().then( () => {
        if(!oAuthService.hasValidAccessToken()){
          oAuthService.initLoginFlow()
        }else {
          oAuthService.loadUserProfile().then( (userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo)
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
}
