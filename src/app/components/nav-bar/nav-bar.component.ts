import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/common/services/account-service/account-service.service';
import { LogInComponent } from '../log-in/log-in.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private modalService: NgbModal, public accountService: AccountService) { }

  ngOnInit(): void {
  }

  openModal(): void {
    const modalRef = this.modalService.open(LogInComponent)
  }

  logout() {
    this.accountService.logout();
  }
}
