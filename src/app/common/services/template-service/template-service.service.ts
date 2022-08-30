import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from '../authentication-service/account-service.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateServiceService {
  baseUrl = "https://localhost:7020/Template/";

  constructor(private http: HttpClient, private accountService: AccountService) { }

}
