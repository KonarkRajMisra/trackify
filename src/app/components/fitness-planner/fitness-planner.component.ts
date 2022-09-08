import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/common/models/User';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { FitnessPlanService } from 'src/app/common/services/fitness-plan-service/fitness-plan.service';
import { checkIfNumber } from 'src/app/common/util/checkIfNumber';
import { FitnessPlan } from 'src/app/common/models/FitnessPlan';
import { Date } from 'src/app/common/models/Date';
@Component({
  selector: 'app-fitness-planner',
  templateUrl: './fitness-planner.component.html',
  styleUrls: ['./fitness-planner.component.css']
})
export class FitnessPlanner implements OnInit {
  faCalendar = faCalendar;
  user!: User;
  tdee = 0
  planCalories = 0
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
    currentWeight: ['',[Validators.required, checkIfNumber()]],
    currentPlan: ['', Validators.required],
    currentDate: ['', Validators.required],
    planEndDate: ['', Validators.required]
  })

  constructor(public accountService: AccountService, private fb: FormBuilder, private fitnessPlanService: FitnessPlanService) { }

  ngOnInit(): void {
    // Get the current User
    this.getCurrentUser();
  }

  changeCurrentWeight(e: any){
    this.currentWeight?.setValue(e.target.value, {
      onlySelf: true
    });
    let currWeight = Number(this.currentWeight?.value);
    this.updateCals(Number(currWeight));
    this.updatePlanCals(currWeight, this.currentPlan?.value!)
  }

  updateCals(weight: number){
    this.tdee = weight * 15;
  }

  updatePlanCals(weight: number, plan: string){
    for (let p of this.plans){
      if(p.name === plan){
        let multiplier =  p.multiplier;
        this.planCalories = weight * multiplier
        break;
      }
    }
  }

  changePlan(e: any){
    this.currentPlan?.setValue(e.target.value, {
      onlySelf: true,
    });
    this.updatePlanCals(Number(this.currentWeight?.value), this.currentPlan?.value!)
  }

  changeCurrentDate(e: any){
    this.currentDate?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get currentWeight(){
    return this.fitnessPlanningForm.get('currentWeight');
  }

  get currentPlan(){
    return this.fitnessPlanningForm.get('currentPlan');
  }

  get currentDate(){
    return this.fitnessPlanningForm.get('currentDate');
  }

  get planEndDate(){
    return this.fitnessPlanningForm.get('planEndDate');
  }

  getCurrentUser(){
    const user: User = JSON.parse(localStorage.getItem('user')!);
    this.user = user;
  }

  onPlanSubmit(){
    let fitnessPlan: FitnessPlan = {
      email: this.user.email,
      planId: 0,
      currentWeight: Number(this.currentWeight?.value),
      currentPlan: this.currentPlan?.value!,
      currentDate: this.currentDate?.value! as unknown as Date,
      planEndDate: this.planEndDate?.value! as unknown as Date,
      currentPlanCalories: this.planCalories,
      status: 'active',
      planData: null
    }
    console.log(fitnessPlan)
    this.fitnessPlanService.createFitnessPlan(fitnessPlan);
  }
}
