import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MealPlan } from '../../models/MealPlan/MealPlan';
import { User } from '../../models/User/User';
import { AccountService } from '../authentication-service/account-service.service';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  baseUrl = "https://localhost:7020/MealPlan/";

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.getCurrentUser()
  }

  createMealPlan(mealPlan: MealPlan) {
    let header = new HttpHeaders().set(`Authorization`, `Bearer ${this.accountService.user.authToken}`);
    const options = {
      headers: header
    }
    const request = {
      mealPlan: mealPlan,
      email: this.accountService.user.email
    }
    this.http.post(this.baseUrl+"createMealPlan", request, options).subscribe((res) => console.log(res));
  }

  getAllMealPlans() {
    let header = new HttpHeaders().set(`Authorization`, `Bearer ${this.accountService.user.authToken}`);
    let params = {'email': this.accountService.user.email}
    const options = {
      headers: header,
      params: params
    }
    return this.http.get<Array<MealPlan>>(this.baseUrl + "getAllMealPlans", options );
  }

  updateMealPlan() {

  }

  deleteMealPlan(mealPlan: MealPlan) {
    let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
    const body = {
      index: mealPlan.mealPlanId,
      email: this.accountService.user.email
    }
    const options = {
        headers: header,
        body: body
    }
    return this.http.delete<User>(this.baseUrl + "deleteMealPlan", options)
        .subscribe((res) => console.log(res));
  }

}
