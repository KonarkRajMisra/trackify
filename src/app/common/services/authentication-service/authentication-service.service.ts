import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleApiService } from '../google-api-service/google-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private googleService: GoogleApiService) { }

  authenticate(): Observable<any> {
    console.log(this.googleService.getIdToken());
    return this.http.post('https://localhost:7020/Authentication/authenticate', {idToken: this.googleService.getIdToken()});
  }
}
