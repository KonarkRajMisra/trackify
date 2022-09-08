import { Component, OnInit } from '@angular/core';
import { FitnessPlan } from 'src/app/common/models/FitnessPlan';
import { User } from 'src/app/common/models/User';
import { FitnessPlanService } from 'src/app/common/services/fitness-plan-service/fitness-plan.service';
import { Date } from 'src/app/common/models/Date';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PlanData } from 'src/app/common/models/PlanData';

@Component({
  selector: 'app-weight-tracker',
  templateUrl: './weight-tracker.component.html',
  styleUrls: ['./weight-tracker.component.css']
})
export class WeightTracker implements OnInit {
  planData = this.fb.group({
    planDatesData: this.fb.array([])
  })
  netCalories = 0;

  planDates!: Array<globalThis.Date>
  user?: User;
  allFitnessPlans?: Array<FitnessPlan>;
  currentActivePlan?: FitnessPlan;
  constructor(private fitnessPlanningService: FitnessPlanService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.fitnessPlanningService.getAllFitnessPlans(this.user?.email!, this.user?.authToken!).subscribe((res: any) => {
      this.allFitnessPlans = res
      this.setCurrentActivePlan()
    })
  }

  getCurrentUser(){
    const user: User = JSON.parse(localStorage.getItem('user')!);
    this.user = user;
  }

  setCurrentActivePlan(){
    for( let plan of this.allFitnessPlans!){
      if (plan.status === 'active'){
        this.currentActivePlan = plan;
        this.calculatePlanDateRange()
      }
    }
    console.log(this.currentActivePlan)
  }

  
  calculatePlanDateRange(){
    let planStartDate = this.convertDateToString(this.currentActivePlan?.currentDate!);
    let planEndDate = this.convertDateToString(this.currentActivePlan?.planEndDate!);
    let startDate = new Date(planStartDate);
    let endDate = new Date(planEndDate);
    let currentDate = startDate;
    let dateArray = [];
    while (currentDate <= endDate){
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.planDates = dateArray;
    this.convertPlanDatesToFormControl(dateArray)
  }

  convertPlanDatesToFormControl(dateArray: Array<globalThis.Date>){
    for(let date of dateArray){
      this.addDate(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
    }
  }

  addDate(stringDate: string) {
    let date = this.createDateGroup(stringDate)
    this.planDatesData.push(date);
  }

  createDateGroup(stringDate: string){
    let newDate = this.fb.group({
      date: this.fb.control(stringDate),
      weight: this.fb.control(0),
      calories: this.fb.control(0),
      notes: this.fb.control('')
    })
    return newDate;
  }

  convertDateToString(date: Date){
    let stringDate = date.year+"-"+date.month+"-"+date.day;
    return stringDate;
  }

  onWeightChange(dateIdx: number, e: any){
    this.planDatesData.at(dateIdx).get('weight')?.setValue(Number(e.target.value));
  }

  onCaloriesChange(dateIdx: number, e: any){
    this.planDatesData.at(dateIdx).get('calories')?.setValue(Number(e.target.value));
    this.setNetCalories()
  }

  setNetCalories(){
    let tdee = 0;
    let totalCals = 0;
    for(let dateObj of this.planDatesData.controls){
      if (dateObj.get('weight')?.value !== '' && dateObj.get('calories')?.value !== '')
      {
        tdee = Number(dateObj.get('weight')?.value) * 15;
        totalCals -= tdee - Number(dateObj.get('calories')?.value)
        console.log(tdee, totalCals, this.netCalories)
      }
      else{
        break;
      }
    }
    this.netCalories = totalCals;
  }

  onNotesChange(dateIdx: number, e: any){
    console.log(this.planDatesData.at(dateIdx))
    this.planDatesData.at(dateIdx).get('notes')?.setValue(e.target.value);
  }

  onPlanDataSubmit(){
    let plan: PlanData = this.planData.value as PlanData;
    this.fitnessPlanningService.submitFitnessPlan(plan);
  }

  get planDatesData() {
    return this.planData.get('planDatesData') as FormArray;
  }
}
