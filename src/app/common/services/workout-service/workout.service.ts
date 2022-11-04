import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/User/User';
import { WorkoutRoutine } from '../../models/Workout/WorkoutRoutine';
import { AccountService } from '../authentication-service/account-service.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  baseUrl = "https://localhost:7020/Workout/"

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.getCurrentUser();
  }

  createWorkoutRoutine(routine: WorkoutRoutine) {
    let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
    const options = {
      headers: header
    }
    return this.http.post<User>(this.baseUrl + 'createRoutine', routine, options)
      .subscribe((res) => console.log(res));
  }

  getWorkoutRoutines(): Observable<Array<WorkoutRoutine>> {
    let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
    let params = { "email": this.accountService.user.email };
    const options = {
      headers: header,
      params: params
    };
    return this.http.get<Array<WorkoutRoutine>>(this.baseUrl + 'getWorkouts', options);
  }
}
