import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NutritionPlan } from 'src/app/common/models/Nutrition/NutritionPlan';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { NutritionPlanService } from 'src/app/common/services/nutrition-plan-service/nutrition-plan.service';

@Component({
  selector: 'app-nutrition-plan-cards',
  templateUrl: './nutrition-plan-cards.component.html',
  styleUrls: ['./nutrition-plan-cards.component.css']
})
export class NutritionPlanCards implements OnInit {

  fitnessPlans: Array<NutritionPlan> | undefined
  constructor(public accountService: AccountService, private nutritionPlanService: NutritionPlanService, private router: Router) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
    if (this.accountService.user != undefined) {
      this.nutritionPlanService.getAllNutritionPlans(this.accountService.user.email, this.accountService.user.authToken).subscribe((res: any) => {
        this.fitnessPlans = res;
        console.log("FITNESSPLANCARDCOMPONENT", this.fitnessPlans);
      })
    }
  }

  onEditPlanClicked(id: number, nutritionPlan: NutritionPlan) {
    this.router.navigateByUrl("/nutritionPlan/" + id, { state: nutritionPlan });
  }

  onCreateFitnessPlanClicked() {
    this.router.navigateByUrl("/nutritionPlan");
  }

}
