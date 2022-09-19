import { Component, OnInit } from '@angular/core';
import { FitnessPlan } from 'src/app/common/models/FitnessPlan';
import { FitnessPlanService } from 'src/app/common/services/fitness-plan-service/fitness-plan.service';
import { Date } from 'src/app/common/models/Date';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PlanData } from 'src/app/common/models/PlanData';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { PlanDateData } from 'src/app/common/models/PlanDateData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-weight-tracker',
  templateUrl: './weight-tracker.component.html',
  styleUrls: ['./weight-tracker.component.css']
})
export class WeightTracker implements OnInit {
  //Form group
  planFormData = this.fb.group({
    planDatesData: this.fb.array([])
  })

  //Props
  netCalorieChange = 0;
  netCaloriesPerRow = 0;
  plannedDates!: Array<globalThis.Date>
  allFitnessPlans?: Array<FitnessPlan>;
  currentActiveFitnessPlan?: FitnessPlan;
  populatedDatesData:PlanDateData[] = []

  constructor(private accountService: AccountService, private fitnessPlanningService: FitnessPlanService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    // get the current user
    this.accountService.getCurrentUser()
    // get all fitness plans
    this.fitnessPlanningService.getAllFitnessPlans(this.accountService.user?.email!, this.accountService.user.authToken!).subscribe((res: any) => {
      this.allFitnessPlans = res
      // set current active plan
      this.setCurrentActivePlan()
    })
  }

  // Getters
  get planDatesData() {
    return this.planFormData.get('planDatesData') as FormArray;
  }

  // Events
  onWeightChange(dateIdx: number, e: any){
    this.planDatesData.at(dateIdx).get('weight')?.setValue(Number(e.target.value));
    this.updatePopulatedDatesData()
  }

  onCaloriesChange(dateIdx: number, e: any){
    this.planDatesData.at(dateIdx).get('calories')?.setValue(Number(e.target.value));
    this.planDatesData.at(dateIdx).get('netcalories')?.setValue(Number(this.getNetCaloriesForDate(this.planDatesData.at(dateIdx).get('weight')?.value, this.planDatesData.at(dateIdx).get('calories')?.value)))
    this.updatePopulatedDatesData()
  }

  onNotesChange(dateIdx: number, e: any): void{
    this.planDatesData.at(dateIdx).get('notes')?.setValue(e.target.value);
  }

  onPlanDataSubmit(){
    let plan: PlanData = this.planFormData.value as PlanData;
    this.sanitizePlan(plan);
    console.log(plan)
    this.fitnessPlanningService.submitFitnessPlanData(plan);
  }

  viewGraphClicked(){
    this.router.navigateByUrl("/graph", {state: this.populatedDatesData})
  }

  // Setters
  setCurrentActivePlan(){
    // iterate over plans
    for( let plan of this.allFitnessPlans!){
      if (plan.status === 'active'){
        // if plan status is active, set it to currentActiveFitnessPlan
        this.currentActiveFitnessPlan = plan;
        // convert plan
        this.convertPlanDates()
      }
    }
  }

  setNetCalories(){
    let tdee = 0;
    let totalCals = 0;
    for(let dateObj of this.planDatesData.controls){
      if (dateObj.get('weight')?.value !== 0 && dateObj.get('calories')?.value !== 0)
      {
        tdee = Number(dateObj.get('weight')?.value) * 15;
        totalCals -= tdee - Number(dateObj.get('calories')?.value)
      }
      else{
        break;
      }
    }
    this.netCaloriesPerRow = totalCals;
  }

  // Logic
  convertPlanDates(){
    // convert date to string
    let planStartDate = this.convertDateToString(this.currentActiveFitnessPlan?.currentDate!);
    let planEndDate = this.convertDateToString(this.currentActiveFitnessPlan?.planEndDate!);
    let startDate = new Date(planStartDate);
    let endDate = new Date(planEndDate);
    let currentDate = startDate;
    let dateArray = [];
    while (currentDate <= endDate){
      // populate all the dates within the plan
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // set plannedDates to populated dateArray
    this.plannedDates = dateArray;
    // convert plannedDates to Form Control
    this.convertPlanDatesToFormControl()
  }

  convertPlanDatesToFormControl(){
    // populate populatedDates
    let populatedDates = []
    for(let data of this.currentActiveFitnessPlan?.planData?.planDatesData!){
      if ( data.weight !== 0 || data.calories !== 0 || data.notes !== ''){
        populatedDates.push(data)
      }
    }
    // for each date, create date string, and create Form group
    for(let date of this.plannedDates){
      this.createFormGroup(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, populatedDates)
    }
    this.updatePopulatedDatesData()
  }

  createFormGroup(stringDate: string, populatedDates: PlanDateData[]) {
    // create form group, for the particular date
    let group = this.createDateGroup(stringDate, populatedDates)
    // add it to planDatesData
    this.planDatesData.push(group);
  }

  updatePopulatedDatesData(){
    let tempArr = []
    this.netCalorieChange = 0
    for (let formData of this.planDatesData.value){
      if (formData.weight != 0 && formData.calories != 0){
        tempArr.push(formData)
        this.netCalorieChange += formData.netcalories
      }
    }
    console.log(tempArr,"TEMPARR")
    this.populatedDatesData = tempArr
  }

  createDateGroup(stringDate: string, populatedDates: PlanDateData[]){
    // Check if date has already been filled by user, if so return populated vals
    for (let populatedDate of populatedDates){
      if (populatedDate.date === stringDate){
        let newDate = this.fb.group({
          date: this.fb.control(stringDate),
          weight: this.fb.control(populatedDate.weight),
          calories: this.fb.control(populatedDate.calories),
          netcalories: this.fb.control(this.getNetCaloriesForDate(populatedDate.weight, populatedDate.calories)),
          notes: this.fb.control(populatedDate.notes)
        })
        this.populatedDatesData.push(populatedDate);
        return newDate
      }
    }

    // Otherwise, create a blank group
    let newDate = this.fb.group({
      date: this.fb.control(stringDate),
      weight: this.fb.control(0),
      calories: this.fb.control(0),
      netcalories: this.fb.control(this.netCaloriesPerRow),
      notes: this.fb.control('')
    })
    return newDate;
  }

  convertDateToString(date: Date){
    let stringDate = date.year+"-"+date.month+"-"+date.day;
    return stringDate;
  }

  getNetCaloriesForDate(weight: number, calories: number): number{
    let tdee = weight * 15;
    let netCals = calories - tdee;
    return netCals
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
}
