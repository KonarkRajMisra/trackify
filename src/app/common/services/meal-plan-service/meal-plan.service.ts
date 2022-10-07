import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MealPlan } from '../../models/MealPlan/MealPlan';
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

  }

  updateMealPlan() {

  }

  deleteMealPlan() {

  }

}
