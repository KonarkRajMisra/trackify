import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, catchError, retry  } from "rxjs";
import { User } from "../../models/user-model";

@Injectable(
    {providedIn: 'root'}
)
export class UserDataService {
    baseUrl: string = "https://localhost:7008/user";
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient){}

    createUser(user: User){
        return this.http.post<any>(
            this.baseUrl+"/signup",
            user,
            this.httpOptions
            ).pipe(
                catchError(this.handleError));
    }

    handleError(error: HttpErrorResponse){
        console.error('An error occured', error.error);
        return throwError(() => new Error(''))
    }
}