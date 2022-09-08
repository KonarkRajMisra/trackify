import { Component, OnInit } from "@angular/core";
import { GoogleApiService } from "src/app/common/services/google-api-service/google-api.service";
import { AccountService } from "src/app/common/services/authentication-service/account-service.service";
import { Router } from "@angular/router";
import { AuthenticationResponse } from "src/app/common/models/AuthenticationResponse";
import { map, Observable } from "rxjs";
import { GoogleUser } from "src/app/common/models/GoogleUser";
import { User } from "src/app/common/models/User";

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

    constructor(private readonly googleService: GoogleApiService, private readonly accountService: AccountService, private router: Router) {
        accountService.currentUser$.subscribe((user) => {
            if (user) {
                router.navigateByUrl('/dash')
            }
        })
    }

    ngOnInit(): void { }

    initiateSignIn() {
        // Get GoogleUser, call account service to get user from the backend
        this.accountService.signIn().subscribe(() => {
            this.accountService.authenticate().subscribe((res) => {
                console.log("authenticate()", res)
                if (res != undefined || res != null) {
                    this.accountService.setCurrentUser(res as User)
                }
            })
        })
    }

    isLoggedIn(): boolean {
        return this.googleService.isLoggedIn();
    }

    logout() {
        this.accountService.logOut();
    }
}
