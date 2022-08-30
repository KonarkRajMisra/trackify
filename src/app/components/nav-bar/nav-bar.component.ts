import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  logout() {
    this.accountService.logout();
  }
}
