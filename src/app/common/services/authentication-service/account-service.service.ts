import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { AuthenticationResponse } from '../../models/AuthenticationResponse';
import { GoogleUser } from '../../models/GoogleUser';
import { User } from '../../models/User';
import { GoogleApiService } from '../google-api-service/google-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "https://localhost:7020/Account/";
  googleProfile!: GoogleUser;
  user!: User;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();


  constructor(private http: HttpClient, private googleService: GoogleApiService) { }

  authenticate() {
    return this.http.post<AuthenticationResponse>(this.baseUrl + 'authenticate', { idToken: this.googleService.getIdToken() })
      .pipe(
        map((response: AuthenticationResponse) => {
          const res = response;
          if (res) {
            this.user = {
              authToken: res.authToken,
              firstTimeUser: res.firstTimeUser,
              email: this.googleProfile.info.email,
              name: this.googleProfile.info.name,
              picture: this.googleProfile.info.picture,
              templates: []
            }
            localStorage.setItem('user', JSON.stringify(this.user));
            this.currentUserSource.next(this.user);
          }
        }
        )
      );
  }

  async setUserAfterGoogleLogin(): Promise<void> {
    this.googleService.googleProfileSubject.subscribe(profile => {
      this.googleProfile = profile;

      // Call authenticate and store user in browser local storage
      // Also, pass the user to currentUserSource observable
      this.authenticate().subscribe();
    })
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  isLoggedIn() {
    return this.user !== null;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('initiated');
    this.currentUserSource.next(null!);
  }

  // get the current user, make request and get all templates, return templates
  getAllTemplates() {
    return this.getCurrentUser().pipe(
      map((user) => {
        if (user !== null) {
          console.log("USER AFTER PIPE", user)
          let options = this.getAuthorizationHeader()
          this.http.get(this.baseUrl + 'getAllTemplates/', options).subscribe((res) =>
            console.log("InsideAccountService", res));
        }
      }))
  }

  getAuthorizationHeader() {
    let header = new HttpHeaders({ 'Authorization': `Bearer ${this.user.authToken}` })
    let params = { "email": this.user.email };
    const options = {
      headers: header,
      params: params
    };
    return options;
  }

  getCurrentUser() {
    // Get current User, apply map to it, return the user
    return this.currentUser$.pipe(map(user => {
      this.user = user;
      return this.user;
    }))
  }
}
