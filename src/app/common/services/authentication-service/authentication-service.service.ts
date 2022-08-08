import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, ReplaySubject } from 'rxjs';
import { AuthenticationResponse } from '../../models/AuthenticationResponse';
import { GoogleUser } from '../../models/GoogleUser';
import { User } from '../../models/User';
import { GoogleApiService } from '../google-api-service/google-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  googleProfile!: GoogleUser;
  user!: User;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();


  constructor(private http: HttpClient, private googleService: GoogleApiService, private modalService: NgbModal) { }

  authenticate() {
    return this.http.post<AuthenticationResponse>('https://localhost:7020/Authentication/authenticate', { idToken: this.googleService.getIdToken() })
      .pipe(
        map((response: AuthenticationResponse) => {
          const res = response;
          if (res) {
            this.user = {
              authToken: res.authToken,
              email: this.googleProfile.info.email,
              name: this.googleProfile.info.name,
              picture: this.googleProfile.info.picture
            }
            console.log(this.user)
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
      console.log("Google profile set", this.googleProfile)
      this.authenticate().subscribe(() => {
        if (this.modalService.hasOpenModals()) {
          this.modalService.dismissAll()
        }
      });
    })
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(this.user);
  }

  isLoggedIn(){
    return this.user !== null;
  }
  logout() {
    localStorage.removeItem('user');
    this.googleService.signOut()
    this.currentUserSource.next(null!);
  }
}
