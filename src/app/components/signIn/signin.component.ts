import { Component, OnInit } from "@angular/core";
import { GoogleApiService } from "src/app/common/services/google-api-service/google-api.service";
import { Customer } from "src/app/common/models/customer";
import { AuthenticationService } from "src/app/common/services/authentication-service/authentication-service.service";

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit{
    customer?: Customer

    constructor(private readonly googleService: GoogleApiService, private readonly authenticationService: AuthenticationService) {}  

    ngOnInit(): void {
        this.googleService.customerProfileSubject.subscribe( info => {
            this.customer = info
            this.authenticationService.authenticate().subscribe();
        })
    }

    isLoggedIn(): boolean {
        return this.googleService.isLoggedIn();
    }

    logout() {
        this.googleService.signOut()
    }
}
