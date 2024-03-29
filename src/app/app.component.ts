import { Component, OnInit } from '@angular/core';
import { GoogleUser } from './common/models/User/GoogleUser';
import { User } from './common/models/User/User';
import { AccountService } from './common/services/authentication-service/account-service.service';
import { GoogleApiService } from './common/services/google-api-service/google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'trackify';
  googleUser: GoogleUser | undefined;

  constructor(private accountService: AccountService, private googleService: GoogleApiService){
  }

  ngOnInit(): void {
      this.getCurrentUser();
  }

  getCurrentUser() {

    // Every time the app loads up, check if user object exists in localStorage
    // if initiated is true, that means google user has been already verified
    const user: User = JSON.parse(localStorage.getItem('user')!);
    const googleUser = JSON.parse(localStorage.getItem('googleUser')!);

    // If initiated exists, reinitialize as google auth token could have expired
    // And reinitialize auth token
    if (googleUser){
      this.accountService.signIn().subscribe()
    }
  }
}
