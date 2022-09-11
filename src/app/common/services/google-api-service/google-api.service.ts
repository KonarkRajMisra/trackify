import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { from, Observable } from 'rxjs';
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
  
  // googleProfileSubject = new Subject<GoogleUser>();
  googleProfile!: GoogleUser;
  constructor(private readonly oAuthService: OAuthService) { }

  initiateGoogleSignIn(): Observable<GoogleUser>{
    this.oAuthService.configure(oAuthConfig);
    return from(this.oAuthService.loadDiscoveryDocumentAndLogin().then(() => {
      return this.oAuthService.tryLoginImplicitFlow().then(() => {
        if(!this.oAuthService.hasValidAccessToken()){
          this.oAuthService.initImplicitFlow()
        }
        return this.loadGoogleUser().then((googleProfile) => googleProfile)
      })
    }))
  }
  
  loadGoogleUser(): Promise<GoogleUser> {
    return this.oAuthService.loadUserProfile().then((googleProfile) => {
      this.googleProfile = googleProfile as GoogleUser;
      console.log("loadGoogleUser()",googleProfile)
      localStorage.setItem('googleUser', JSON.stringify(this.googleProfile));
      return this.googleProfile;
    })
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  logOut() {
    this.oAuthService.logOut()
  }

  getAuthorizationHeader() {
    return this.oAuthService.authorizationHeader();
  }

  getIdToken() {
    return this.oAuthService.getIdToken();
  }
}
