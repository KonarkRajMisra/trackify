import { Component, OnInit } from '@angular/core';
import { NutritionData } from 'src/app/common/models/Nutrition/NutritionData';
import { DateData } from 'src/app/common/models/DateData';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { NutritionPlanService } from 'src/app/common/services/nutrition-plan-service/nutrition-plan.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  nutritionData?: NutritionData
  dateData?: DateData[]

  constructor(private accountService: AccountService, private nutritionPlanService: NutritionPlanService) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    this.nutritionPlanService.getAllNutritionPlans(this.accountService.user.email, this.accountService.user.authToken).subscribe((res) => {
      this.nutritionData = res[0].nutritionData!
      this.dateData = this.nutritionData?.dateData
      console.log("PDD was Set", this.dateData)
    }
    )
  }
}
