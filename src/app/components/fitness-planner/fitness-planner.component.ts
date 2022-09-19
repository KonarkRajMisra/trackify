import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { FitnessPlanService } from 'src/app/common/services/fitness-plan-service/fitness-plan.service';
import { checkIfNumber } from 'src/app/common/util/checkIfNumber';
import { FitnessPlan } from 'src/app/common/models/FitnessPlan';
import { Date } from 'src/app/common/models/Date';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { PlanData } from 'src/app/common/models/PlanData';
@Component({
  selector: 'app-fitness-planner',
  templateUrl: './fitness-planner.component.html',
  styleUrls: ['./fitness-planner.component.css']
})
export class FitnessPlanner implements OnInit {
  currentFitnessPlan: FitnessPlan | undefined;
  editPlan: boolean = false;
  faCalendar = faCalendar;
  tdee = 0;
  planCalories = 0;
  plans = [
    {
      name: 'Aggressive Fat Loss',
      multiplier: 10
    },
    {
      name: 'Moderate Fat Loss',
      multiplier: 12
    },
    {
      name: 'Slow Weight Loss',
      multiplier: 13
    },
    {
      name: 'Maintain',
      multiplier: 15
    },
    {
      name: 'Lean Gain',
      multiplier: 16
    },
    {
      name: 'Moderate Gain',
      multiplier: 18
    },
    {
      name: 'Aggressive Gain',
      multiplier: 20
    }
  ]

  fitnessPlanningForm = this.fb.group({
    currentWeight: ['', [Validators.required, checkIfNumber()]],
    currentPlan: ['', Validators.required],
    currentDate: [new NgbDate(2022,8,22), Validators.required],
    planEndDate: [new NgbDate(2022,8,22), Validators.required]
  })

  constructor(public accountService: AccountService, private fb: FormBuilder, private fitnessPlanService: FitnessPlanService, private router: Router) {
    this.currentFitnessPlan = this.router.getCurrentNavigation()?.extras.state as FitnessPlan;
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    console.log("CurrentFITNESSPLAN", this.currentFitnessPlan)
    if (this.currentFitnessPlan != undefined){
      this.updateFormWithFitnessPlanVals();
    }
    console.log("FITNESSPLANNERCOMPONENT");
  }

  updateFormWithFitnessPlanVals(){
    this.editPlan = true;
    this.fitnessPlanningForm.patchValue({
      currentWeight: this.currentFitnessPlan?.currentWeight.toString(),
      currentPlan: this.currentFitnessPlan?.currentPlan,
      currentDate:  new NgbDate(Number(this.currentFitnessPlan?.currentDate.year), Number(this.currentFitnessPlan?.currentDate.month), Number(this.currentFitnessPlan?.currentDate.day)),
      planEndDate: new NgbDate(Number(this.currentFitnessPlan?.planEndDate.year), Number(this.currentFitnessPlan?.planEndDate.month), Number(this.currentFitnessPlan?.planEndDate.day))
    })
    this.updateCals(Number(this.currentWeight?.value))
    this.updatePlanCals(Number(this.currentWeight?.value), this.currentPlan?.value?.toString()!)
    console.log("UPDATEDPLAN", this.fitnessPlanningForm)
  }

  changeCurrentWeight(e: any) {
    this.currentWeight?.setValue(e.target.value, {
      onlySelf: true
    });
    let currWeight = Number(this.currentWeight?.value);
    this.updateCals(Number(currWeight));
    this.updatePlanCals(currWeight, this.currentPlan?.value!)
  }

  updateCals(weight: number) {
    this.tdee = weight * 15;
  }

  updatePlanCals(weight: number, plan: string) {
    for (let p of this.plans) {
      if (p.name.toLowerCase() === plan.toLowerCase()) {
        let multiplier = p.multiplier;
        this.planCalories = weight * multiplier
        break;
      }
    }
  }

  changePlan(e: any) {
    console.log(e.target.value)
    this.currentPlan?.setValue(e.target.value, {
      onlySelf: true,
    });
    this.updatePlanCals(Number(this.currentWeight?.value), this.currentPlan?.value!)
  }

  changeCurrentDate(e: any) {
    console.log(e.target.value)
    this.currentDate?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get currentWeight() {
    return this.fitnessPlanningForm.get('currentWeight');
  }

  get currentPlan() {
    return this.fitnessPlanningForm.get('currentPlan');
  }

  get currentDate() {
    return this.fitnessPlanningForm.get('currentDate');
  }

  get planEndDate() {
    return this.fitnessPlanningForm.get('planEndDate');
  }

  onPlanSubmit() {
    let fitnessPlan: FitnessPlan = {
      email: this.accountService.user.email,
      planId: 0,
      currentWeight: Number(this.currentWeight?.value),
      currentPlan: this.currentPlan?.value!,
      currentDate: this.currentDate?.value! as unknown as Date,
      planEndDate: this.planEndDate?.value! as unknown as Date,
      currentPlanCalories: this.planCalories,
      status: 'active',
      planData: {email: this.accountService.user.email, planDatesData: []} as PlanData
    }
    console.log(fitnessPlan)
    this.fitnessPlanService.createFitnessPlan(fitnessPlan);
  }

  editSelectedPlan(){
    let fitnessPlan: FitnessPlan = {
      email: this.accountService.user.email,
      planId: this.currentFitnessPlan?.planId as number,
      currentWeight: Number(this.currentWeight?.value),
      currentPlan: this.currentPlan?.value!,
      currentDate: this.currentDate?.value! as unknown as Date,
      planEndDate: this.planEndDate?.value! as unknown as Date,
      currentPlanCalories: this.planCalories,
      status: 'active',
      planData: this.currentFitnessPlan?.planData as PlanData
    }
    console.log(this.currentFitnessPlan);
    console.log(fitnessPlan)
    this.fitnessPlanService.updateFitnessPlan(fitnessPlan);
  }

  deleteSelectedPlan(){
    console.log(this.currentFitnessPlan);
    this.fitnessPlanService.deleteFitnessPlan(this.currentFitnessPlan!);
  }
}
