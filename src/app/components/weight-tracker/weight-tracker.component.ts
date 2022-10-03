import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NutritionPlan } from 'src/app/common/models/Nutrition/NutritionPlan';
import { NutritionPlanService } from 'src/app/common/services/nutrition-plan-service/nutrition-plan.service';
import { FormGroup } from '@angular/forms';
import { NutritionData } from 'src/app/common/models/Nutrition/NutritionData';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { DateData } from 'src/app/common/models/DateData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-weight-tracker',
  templateUrl: './weight-tracker.component.html',
  styleUrls: ['./weight-tracker.component.css']
})
export class WeightTracker implements OnInit, AfterViewChecked {

  //Props
  allNutritionPlans?: Array<NutritionPlan>;
  activeNutritionPlan?: NutritionPlan;
  planFormData?: FormGroup<any>
  populatedDates?: DateData[]
  netCals?: number;
  currentWeek: number = 1;

  constructor(private accountService: AccountService, private nutritionPlanningService: NutritionPlanService, private router: Router, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    // get the current user
    
    this.accountService.getCurrentUser()
    // get all fitness plans
    this.nutritionPlanningService.getAllNutritionPlans(this.accountService.user?.email!, this.accountService.user.authToken!).subscribe((res: any) => {
      this.allNutritionPlans = res
      // set current active plan
      this.setCurrentActivePlan()
    })
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges()
  }

  // Setters
  setCurrentActivePlan() {
    // iterate over plans
    for (let plan of this.allNutritionPlans!) {
      if (plan.status === 'active') {
        // if plan status is active, set it to currentActiveNutritionPlan
        this.activeNutritionPlan = plan;
      }
    }
  }

  // Event handler from child
  nutritionPlanHandler(nutritionPlanForm: FormGroup<any>) {
    this.planFormData = nutritionPlanForm
  }

  populatedDatesHandler(populatedDatesData: DateData[]) {
    this.populatedDates = populatedDatesData;
  }

  weekUpdateHandler(week: number){
    this.currentWeek = week;
  }

  netCalorieChangeHandler(cal: number){
    this.netCals = cal;
  }
  
  // Event handler for button clicks
  onPlanDataSubmit() {
    let plan: NutritionData = this.planFormData?.value as NutritionData;
    this.sanitizePlan(plan);
    console.log(plan)
    this.nutritionPlanningService.submitNutritionData(plan);
  }

  viewGraphClicked() {
    this.router.navigateByUrl("/graph", { state: this.populatedDates })
  }

  convertJsDateToString(date: globalThis.Date) {
    let stringDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return stringDate;
  }

  sanitizePlan(plan: NutritionData) {
    let newArr = []
    for (let i = 0; i < plan.dateData.length; i++) {
      let date = plan.dateData[i];
      if (date.weight !== 0) {
        newArr.push(date)
      }
    }
    plan.dateData = newArr
  }

  viewFitnessSummary() {
    this.nutritionPlanningService.getNutritionPlanSummary(this.accountService.user.email, this.accountService.user.authToken).subscribe((res) => console.log("SUMMARY", res))
  }
}
