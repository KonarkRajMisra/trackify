import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FitnessPlan } from 'src/app/common/models/FitnessPlan';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { FitnessPlanService } from 'src/app/common/services/fitness-plan-service/fitness-plan.service';

@Component({
  selector: 'app-fitness-plan-cards',
  templateUrl: './fitness-plan-cards.component.html',
  styleUrls: ['./fitness-plan-cards.component.css']
})
export class FitnessPlanCardsComponent implements OnInit {

  fitnessPlans: Array<FitnessPlan> | undefined
  constructor(public accountService: AccountService, private fitnessPlanService: FitnessPlanService, private router: Router) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
    if (this.accountService.user != undefined) {
      this.fitnessPlanService.getAllFitnessPlans(this.accountService.user.email, this.accountService.user.authToken).subscribe((res: any) => {
        this.fitnessPlans = res;
        console.log("FITNESSPLANCARDCOMPONENT", this.fitnessPlans);
      })
    }
  }

  onEditPlanClicked(id: number, fitnessPlan: FitnessPlan) {
    this.router.navigateByUrl("/fitnessPlan/" + id, { state: fitnessPlan });
  }

  onCreateFitnessPlanClicked(){
    this.router.navigateByUrl("/fitnessPlan");
  }

}
