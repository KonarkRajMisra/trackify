import { Component, OnInit } from "@angular/core";
import { GoogleApiService } from "src/app/common/services/google-api-service/google-api.service";
import { AccountService } from "src/app/common/services/account-service/account-service.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal, private readonly googleService: GoogleApiService, private readonly accountService: AccountService) { }

    ngOnInit(): void {

    }

    async onGoogleButtonClick(): Promise<void> {
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
