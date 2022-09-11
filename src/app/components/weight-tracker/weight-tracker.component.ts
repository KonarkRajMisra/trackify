import { Component, OnInit } from '@angular/core';
import { FitnessPlan } from 'src/app/common/models/FitnessPlan';
import { FitnessPlanService } from 'src/app/common/services/fitness-plan-service/fitness-plan.service';
import { Date } from 'src/app/common/models/Date';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PlanData } from 'src/app/common/models/PlanData';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { PlanDateData } from 'src/app/common/models/PlanDateData';

@Component({
  selector: 'app-weight-tracker',
  templateUrl: './weight-tracker.component.html',
  styleUrls: ['./weight-tracker.component.css']
})
export class WeightTracker implements OnInit {
  netCalories = 0;

  planDates!: Array<globalThis.Date>
  allFitnessPlans?: Array<FitnessPlan>;
  currentActivePlan?: FitnessPlan;
  
  planData = this.fb.group({
    planDatesData: this.fb.array([])
  })

  constructor(private accountService: AccountService, private fitnessPlanningService: FitnessPlanService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
    this.fitnessPlanningService.getAllFitnessPlans(this.accountService.user?.email!, this.accountService.user.authToken!).subscribe((res: any) => {
      this.allFitnessPlans = res
      this.setCurrentActivePlan()
      this.setNetCalories()
    })
  }

  setCurrentActivePlan(){
    for( let plan of this.allFitnessPlans!){
      if (plan.status === 'active'){
        this.currentActivePlan = plan;
        this.calculatePlanDateRange(plan)
      }
    }
  }

  
  calculatePlanDateRange(plan: FitnessPlan){
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
    this.convertPlanDatesToFormControl(dateArray, plan)
  }

  convertPlanDatesToFormControl(dateArray: Array<globalThis.Date>, plan: FitnessPlan){
    let propogatedDatesData = []
    for(let data of plan.planData?.planDatesData!){
      if ( data.weight !== 0 || data.calories !== 0 || data.notes !== '')
      propogatedDatesData.push(data)
    }
    for(let date of dateArray){
      this.addDate(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, propogatedDatesData)
    }
  }

  addDate(stringDate: string, propogatedDatesData: PlanDateData[]) {
    console.log(stringDate, propogatedDatesData)
    let date = this.createDateGroup(stringDate, propogatedDatesData)
    this.planDatesData.push(date);
  }

  createDateGroup(stringDate: string, propogatedDatesData: PlanDateData[]){
    // Check if date has already been filled by user, if so return populated vals
    for (let propogatedDate of propogatedDatesData){
      if (propogatedDate.date === stringDate){
        let newDate = this.fb.group({
          date: this.fb.control(stringDate),
          weight: this.fb.control(propogatedDate.weight),
          calories: this.fb.control(propogatedDate.calories),
          notes: this.fb.control(propogatedDate.notes)
        })
        return newDate
      }
    }

    // Otherwise, create a blank group
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
    this.sanitizePlan(plan);
    this.fitnessPlanningService.submitFitnessPlanData(plan);
  }

  sanitizePlan(plan: PlanData){
    let newArr = []
    for(let i = 0; i <  plan.planDatesData.length; i++){
      let date = plan.planDatesData[i];
      if (date.weight !== 0)
      {
        newArr.push(date)
      }
    }
    plan.planDatesData = newArr
  }

  get planDatesData() {
    return this.planData.get('planDatesData') as FormArray;
  }

  viewGraphClicked(){
    
  }
}
