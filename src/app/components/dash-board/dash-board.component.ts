import { Component, OnInit } from '@angular/core';
import { Template } from 'src/app/common/models/Template';
import { User } from 'src/app/common/models/User';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  userTemplates: Array<Template> | undefined

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
  }
}
