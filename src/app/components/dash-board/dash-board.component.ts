import { Component, OnInit } from '@angular/core';
import { PlanData } from 'src/app/common/models/PlanData';
import { PlanDateData } from 'src/app/common/models/PlanDateData';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { FitnessPlanService } from 'src/app/common/services/fitness-plan-service/fitness-plan.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  planData?: PlanData
  planDatesData?: PlanDateData[]

  constructor(private accountService: AccountService, private fitnessPlanService: FitnessPlanService) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    this.fitnessPlanService.getAllFitnessPlans(this.accountService.user.email, this.accountService.user.authToken).subscribe((res) => {
      this.planData = res[0].planData!
      this.planDatesData = this.planData?.planDatesData
      console.log("PDD was Set", this.planDatesData)
    }
    )
  }
}
