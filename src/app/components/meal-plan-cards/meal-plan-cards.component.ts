import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MealPlan } from 'src/app/common/models/MealPlan/MealPlan';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { MealPlanService } from 'src/app/common/services/meal-plan-service/meal-plan.service';

@Component({
  selector: 'app-meal-plan-cards',
  templateUrl: './meal-plan-cards.component.html',
  styleUrls: ['./meal-plan-cards.component.css']
})
export class MealPlanCardsComponent implements OnInit {

  mealPlans: Array<MealPlan> | undefined
  constructor(private router: Router, private accountService: AccountService, private mealPlanService: MealPlanService) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
    this.mealPlanService.getAllMealPlans().subscribe((res) => {
      this.mealPlans = res
      console.log("MEALPLANS", this.mealPlans)
    })
  }

  onCreateMealPlanClick(){
    this.router.navigateByUrl('/mealPlan')
  }

  onEditMealPlanClick(id: number, mealPlan: MealPlan){
    this.router.navigateByUrl("/mealPlan/"+id, {state : mealPlan})
  }

}
