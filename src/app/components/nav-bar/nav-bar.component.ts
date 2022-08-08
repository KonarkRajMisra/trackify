import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { User } from 'src/app/common/models/User';
import { AuthenticationService } from 'src/app/common/services/authentication-service/authentication-service.service';
import { LogInComponent } from '../log-in/log-in.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private modalService: NgbModal, public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  openModal(): void {
    const modalRef = this.modalService.open(LogInComponent)
  }

  logout() {
    this.authenticationService.logout();
  }
}
