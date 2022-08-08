import { Component, OnInit } from '@angular/core';
import { GoogleUser } from './common/models/GoogleUser';
import { User } from './common/models/User';
import { AuthenticationService } from './common/services/authentication-service/authentication-service.service';
import { GoogleApiService } from './common/services/google-api-service/google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'trackify';
  googleUser: GoogleUser | undefined;

  constructor(private authenticationService: AuthenticationService, private googleService: GoogleApiService){
  }

  ngOnInit(): void {
      this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    const initiated = JSON.parse(localStorage.getItem('initiated')!);
    console.log(this.googleUser)
    if (initiated){
      this.googleService.initiateSignIn().then(() => 
      this.authenticationService.setUserAfterGoogleLogin());
    }
    if (this.googleUser){
      this.authenticationService.setUserAfterGoogleLogin();
    }
    if(user){
      this.authenticationService.setCurrentUser(user);
    }
  }
}
