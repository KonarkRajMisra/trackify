import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/common/services/user-data-service/user-data-service';
import { User } from 'src/app/common/models/user-model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [UserDataService]
})
export class SignupComponent implements OnInit {

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    // TODO: add form validation for passwords
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const email = this.signUpForm.get('email')?.value;
    const password = this.signUpForm.get('password')?.value;
    console.log(email, password);
    if (email && password) {
      var user: User = new User(email!, password!);
      if (user != null) {
        console.log(this.userDataService.createUser(user))
      }
    }
  }

  ngOnInit(): void {
  }
  constructor(private userDataService: UserDataService) { }

}
