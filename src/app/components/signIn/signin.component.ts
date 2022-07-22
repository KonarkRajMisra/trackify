import { Component, OnInit } from "@angular/core";

var google = (<any>window).google
@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {


    constructor() { }

    ngOnInit(): void {
        window.onload = () => {
            google.accounts.id.initialize({
            client_id: "48301263695-3je8eommj5iqskcfv49q1fqdkekvke4f.apps.googleusercontent.com",
            callback: this.handleCredentialResponse
          });
          google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }
          );
          google.accounts.id.prompt();
        }
    }

    private handleCredentialResponse(response: any) {
        console.log("Encoded JWT ID token: ", response);
    }

}
