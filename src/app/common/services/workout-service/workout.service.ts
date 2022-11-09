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
    return this.http.post<User>(this.baseUrl + 'createRoutine', {email: this.accountService.user.email, workoutRoutine: routine}, options)
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

  getWorkoutRoutine(routineId: number): Observable<WorkoutRoutine> {
    let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
    let params = { "email": this.accountService.user.email, "routineId": routineId };
    const options = {
      headers: header,
      params: params
    };
    return this.http.get<WorkoutRoutine>(this.baseUrl + 'getWorkout', options);
  }

  deleteWorkoutRoutine(routineId: number) {
    let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
    let body = { "email": this.accountService.user.email, "routineId": routineId };
    const options = {
      headers: header,
      body: body
    };
    return this.http.delete<Array<WorkoutRoutine>>(this.baseUrl + 'deleteRoutine', options);
  }

  updateWorkoutRoutine(routine: WorkoutRoutine) {
    let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
    const options = {
      headers: header
    }
    return this.http.patch(this.baseUrl + 'updateRoutine', {email: this.accountService.user.email, workoutRoutine: routine}, options)
      .subscribe((res) => console.log(res));
  }
}
