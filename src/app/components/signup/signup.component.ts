import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  signUpForm = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.email]),
    // TODO: add form validation for passwords
    password : new FormControl('', [Validators.required]),
  });
  onSubmit(){
    
  }
  constructor() { }

  ngOnInit(): void {
  }

}
