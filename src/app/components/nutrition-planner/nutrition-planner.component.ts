import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { NutritionPlanService } from 'src/app/common/services/nutrition-plan-service/nutrition-plan-service';
import { checkIfNumber } from 'src/app/common/util/checkIfNumber';
import { NutritionPlan } from 'src/app/common/models/Nutrition/NutritionPlan';
import { Date } from 'src/app/common/models/Date';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NutritionData } from 'src/app/common/models/Nutrition/NutritionData';
@Component({
  selector: 'app-nutrition-planner',
  templateUrl: './nutrition-planner.component.html',
  styleUrls: ['./nutrition-planner.component.css']
})
export class NutritionPlanner implements OnInit {
  nutritionPlan: NutritionPlan | undefined;
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
    startingWeight: ['', [Validators.required, checkIfNumber()]],
    planName: ['', Validators.required],
    startDate: [new NgbDate(2022,8,22), Validators.required],
    endDate: [new NgbDate(2022,8,22), Validators.required]
  })

  constructor(public accountService: AccountService, private fb: FormBuilder, private nutritionPlanService: NutritionPlanService, private router: Router) {
    this.nutritionPlan = this.router.getCurrentNavigation()?.extras.state as NutritionPlan;
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    if (this.nutritionPlan != undefined){
      this.updateFormWithNutritionPlanVals();
    }
  }

  updateFormWithNutritionPlanVals(){
    this.editPlan = true;
    this.fitnessPlanningForm.patchValue({
      startingWeight: this.nutritionPlan?.startingWeight.toString(),
      planName: this.nutritionPlan?.planName,
      startDate:  new NgbDate(Number(this.nutritionPlan?.startDate.year), Number(this.nutritionPlan?.startDate.month), Number(this.nutritionPlan?.startDate.day)),
      endDate: new NgbDate(Number(this.nutritionPlan?.endDate.year), Number(this.nutritionPlan?.endDate.month), Number(this.nutritionPlan?.endDate.day))
    })
    this.updateCals(Number(this.startingWeight?.value))
    this.updatePlanCals(Number(this.startingWeight?.value), this.planName?.value?.toString()!)
  }

  changeCurrentWeight(e: any) {
    this.startingWeight?.setValue(e.target.value, {
      onlySelf: true
    });
    let currWeight = Number(this.startingWeight?.value);
    this.updateCals(Number(currWeight));
    this.updatePlanCals(currWeight, this.planName?.value!)
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
    this.planName?.setValue(e.target.value, {
      onlySelf: true,
    });
    this.updatePlanCals(Number(this.startingWeight?.value), this.planName?.value!)
  }

  changeCurrentDate(e: any) {
    console.log(e.target.value)
    this.startDate?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get startingWeight() {
    return this.fitnessPlanningForm.get('startingWeight');
  }

  get planName() {
    return this.fitnessPlanningForm.get('planName');
  }

  get startDate() {
    return this.fitnessPlanningForm.get('startDate');
  }

  get endDate() {
    return this.fitnessPlanningForm.get('endDate');
  }

  onPlanSubmit() {
    let nutritionPlan: NutritionPlan = {
      email: this.accountService.user.email,
      planId: 0,
      startingWeight: Number(this.startingWeight?.value),
      planName: this.planName?.value!,
      startDate: this.startDate?.value! as unknown as Date,
      endDate: this.endDate?.value! as unknown as Date,
      planCalories: this.planCalories,
      status: 'active',
      nutritionData: {email: this.accountService.user.email, dateData: []} as NutritionData
    }
    console.log(nutritionPlan)
    this.nutritionPlanService.createNutritionPlan(nutritionPlan);
  }

  editSelectedPlan(){
    let nutritionPlan: NutritionPlan = {
      email: this.accountService.user.email,
      planId: this.nutritionPlan?.planId as number,
      startingWeight: Number(this.startingWeight?.value),
      planName: this.planName?.value!,
      startDate: this.startDate?.value! as unknown as Date,
      endDate: this.endDate?.value! as unknown as Date,
      planCalories: this.planCalories,
      status: 'active',
      nutritionData: this.nutritionPlan?.nutritionData as NutritionData
    }
    console.log(this.nutritionPlan);
    console.log(nutritionPlan)
    this.nutritionPlanService.updateNutritionPlan(nutritionPlan);
  }

  deleteSelectedPlan(){
    console.log(this.nutritionPlan);
    this.nutritionPlanService.deleteNutritionPlan(this.nutritionPlan!);
  }
}
