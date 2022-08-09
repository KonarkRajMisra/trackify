import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { GoogleUser } from '../../models/GoogleUser';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '48301263695-3je8eommj5iqskcfv49q1fqdkekvke4f.apps.googleusercontent.com',
  useSilentRefresh: true,
  scope: 'openid profile email'
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  
  googleProfileSubject = new Subject<GoogleUser>();
  constructor(private readonly oAuthService: OAuthService) { }

  async initiateSignIn(): Promise<void> {
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout'
    this.oAuthService.loadDiscoveryDocument().then( () => {
      this.oAuthService.tryLoginImplicitFlow().then( () => {
        if(!this.oAuthService.hasValidAccessToken()){
          this.oAuthService.initImplicitFlow()
          localStorage.setItem('initiated', 'true');
        }else {
          this.loadGoogleUser();
        }
      })
    })
  }
  
  loadGoogleUser() {
    this.oAuthService.loadUserProfile().then((googleProfile) => {
      this.googleProfileSubject.next(googleProfile as GoogleUser)
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
