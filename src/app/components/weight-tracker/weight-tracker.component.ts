import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NutritionProtocol } from 'src/app/common/models/Nutrition/NutritionProtocol';
import { NutritionProtocolService } from 'src/app/common/services/nutrition-protocol-service/nutrition-protocol.service';
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
  allNutritionProtocols?: Array<NutritionProtocol>;
  activeNutritionProtocol?: NutritionProtocol;
  planFormData?: FormGroup<any>
  populatedDates?: DateData[]
  netCals?: number;
  currentWeek: number = 1;

  constructor(private accountService: AccountService, private nutritionProtocolService: NutritionProtocolService, private router: Router, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    // get the current user
    
    this.accountService.getCurrentUser()
    // get all fitness plans
    this.nutritionProtocolService.getAllNutritionProtocols(this.accountService.user?.email!, this.accountService.user.authToken!).subscribe((res: any) => {
      this.allNutritionProtocols = res
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
    for (let plan of this.allNutritionProtocols!) {
      if (plan.status === 'active') {
        // if plan status is active, set it to currentActiveNutritionProtocol
        this.activeNutritionProtocol = plan;
      }
    }
  }

  // Event handler from child
  nutritionProtocolHandler(nutritionProtocolForm: FormGroup<any>) {
    this.planFormData = nutritionProtocolForm
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
    this.nutritionProtocolService.submitNutritionData(plan);
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
    this.nutritionProtocolService.getNutritionProtocolSummary(this.accountService.user.email, this.accountService.user.authToken).subscribe((res) => console.log("SUMMARY", res))
  }
}
