import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/models/User';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User;
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    // Get the current User
    this.getCurrentUser();
  }

  getCurrentUser(){
    const user: User = JSON.parse(localStorage.getItem('user')!);
    this.user = user;
  }

}
