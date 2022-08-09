import { Component, OnInit } from '@angular/core';
import { GoogleUser } from './common/models/GoogleUser';
import { User } from './common/models/User';
import { AccountService } from './common/services/account-service/account-service.service';
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
      this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    const initiated = JSON.parse(localStorage.getItem('initiated')!);
    console.log(user)
    if (initiated){
      this.googleService.initiateSignIn().then(() => 
      this.accountService.setUserAfterGoogleLogin());
    }
    if(user){
      this.accountService.setCurrentUser(user);
    }
  }
}
