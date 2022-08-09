import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/common/services/account-service/account-service.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  

}
