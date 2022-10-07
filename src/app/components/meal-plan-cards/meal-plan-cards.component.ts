import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MealPlan } from 'src/app/common/models/MealPlan/MealPlan';

@Component({
  selector: 'app-meal-plan-cards',
  templateUrl: './meal-plan-cards.component.html',
  styleUrls: ['./meal-plan-cards.component.css']
})
export class MealPlanCardsComponent implements OnInit {

  mealPlans: Array<MealPlan> | undefined
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onCreateMealPlanClick(){
    this.router.navigateByUrl('/createMealPlan')
  }

}
