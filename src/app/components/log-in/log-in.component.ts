import { Component, OnInit } from "@angular/core";
import { GoogleApiService } from "src/app/common/services/google-api-service/google-api.service";
import { AccountService } from "src/app/common/services/authentication-service/account-service.service";

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

    constructor(private readonly googleService: GoogleApiService, private readonly accountService: AccountService) { }

    ngOnInit(): void {}

    async onGoogleButtonClick(): Promise<void> {
        // Login using google, then authenticate with AccountService and getToken
        await this.googleService.initiateSignIn().then(() => {
            this.accountService.setUserAfterGoogleLogin();
        })
    }

    isLoggedIn(): boolean {
        return this.googleService.isLoggedIn();
    }

    logout() {
        this.accountService.logout();
        this.googleService.signOut()
    }
}
