import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    console.log(this.accountService.user)
  }

}
