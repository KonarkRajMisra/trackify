import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AuthenticationResponse } from '../../models/AuthenticationResponse';
import { GoogleUser } from '../../models/GoogleUser';
import { User } from '../../models/User';
import { GoogleApiService } from '../google-api-service/google-api.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "https://localhost:7020/Account/";
  googleProfile!: GoogleUser;
  user!: User;
  private currentUserSource = new ReplaySubject<User>(1);
  private googleUserSource = new ReplaySubject<GoogleUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  googleUser$ = this.googleUserSource.asObservable();

  constructor(private http: HttpClient, private googleService: GoogleApiService) {
    this.initUser()
  }

  authenticate(): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(this.baseUrl + 'authenticate', { idToken: this.googleService.getIdToken() });
  }

  setCurrentUser(user: User) {
    this.user = {
      authToken: user.authToken,
      firstTimeUser: user.firstTimeUser,
      email: this.googleProfile.info.email,
      name: this.googleProfile.info.name,
      picture: this.googleProfile.info.picture,
      templates: [],
      fitnessPlans: []
    }
    localStorage.setItem('user', JSON.stringify(this.user));
    this.currentUserSource.next(this.user);
  }

  isLoggedIn() {
    return this.user !== null;
  }

  logOut() {
    this.currentUserSource.next(null!);
    localStorage.removeItem('user');
    localStorage.removeItem('initiated');
  }

  // get the current user, make request and get all templates, return templates
  getAllTemplates() {
    if (this.user !== undefined && this.user.email) {
      let options = this.getAuthorizationHeader()
      return this.http.get(this.baseUrl + 'getAllTemplates/', options)
    }
    return null;
  }

  getAuthorizationHeader() {
    let header = new HttpHeaders().set('Authorization', `Bearer ${this.user.authToken}`)
    let params = { "email": this.user.email };
    const options = {
      headers: header,
      params: params
    };
    return options;
  }

  signIn() {
    return this.googleService.initiateGoogleSignIn().pipe(
      map((googleUser) => {
        this.googleProfile = JSON.parse(localStorage.getItem('googleUser')!) as GoogleUser;
        console.log("onGoogleButtonClick", googleUser)
        this.authenticate().subscribe((res) => {
          if (res != undefined || res != null) {
            this.setCurrentUser(res as User)
          }
        })
      })
    )
  }

  initUser() {
    // Every time the app loads up, check if user object exists in localStorage
    // if initiated is true, that means google user has been already verified
    const user: User = JSON.parse(localStorage.getItem('user')!);
    const initiated = JSON.parse(localStorage.getItem('initiated')!);

    // If initiated exists, reinitialize as google auth token could have expired
    // And reinitialize auth token
    if (initiated) {
    }
    // Set current user as well
  }
}
