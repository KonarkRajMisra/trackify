import { Component, OnInit } from "@angular/core";
import { GoogleApiService } from "src/app/common/services/google-api-service/google-api.service";
import { UserInfo } from "src/app/common/models/user-info";

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SignInComponent {
    userInfo?: UserInfo

    constructor(private readonly googleService: GoogleApiService) {     
        googleService.userProfileSubject.subscribe( info => {
            this.userInfo = info
        })
    }

    isLoggedIn(): boolean {
        return this.googleService.isLoggedIn();
    }

    logout() {
        this.googleService.signOut()
    }
}
