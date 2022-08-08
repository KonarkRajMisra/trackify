import { Component, OnInit } from "@angular/core";
import { GoogleApiService } from "src/app/common/services/google-api-service/google-api.service";
import { GoogleUser } from "src/app/common/models/GoogleUser";
import { AuthenticationService } from "src/app/common/services/authentication-service/authentication-service.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "src/app/common/models/User";
import { map } from "rxjs";
import { AuthenticationResponse } from "src/app/common/models/AuthenticationResponse";

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal, private readonly googleService: GoogleApiService, private readonly authenticationService: AuthenticationService) { }

    ngOnInit(): void {

    }

    async onGoogleButtonClick(): Promise<void> {
        await this.googleService.initiateSignIn().then(() => {
            this.authenticationService.setUserAfterGoogleLogin();
        })
    }

    isLoggedIn(): boolean {
        return this.googleService.isLoggedIn();
    }

    logout() {
        this.authenticationService.logout();
        this.googleService.signOut()
    }
}
