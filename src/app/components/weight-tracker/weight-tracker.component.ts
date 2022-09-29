import { Component, OnInit } from '@angular/core';
import { NutritionPlan } from 'src/app/common/models/Nutrition/NutritionPlan';
import { NutritionPlanService } from 'src/app/common/services/nutrition-plan-service/nutrition-plan-service';
import { Date } from 'src/app/common/models/Date';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NutritionData } from 'src/app/common/models/Nutrition/NutritionData';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { DateData } from 'src/app/common/models/DateData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-weight-tracker',
  templateUrl: './weight-tracker.component.html',
  styleUrls: ['./weight-tracker.component.css']
})
export class WeightTracker implements OnInit {
  //Form group
  nutritionPlanForm = this.fb.group({
    dateData: this.fb.array([])
  })

  //Props
  netCalorieChange = 0;
  netCaloriesPerRow = 0;
  plannedDates!: Array<globalThis.Date>
  allNutritionPlans?: Array<NutritionPlan>;
  currentActiveNutritionPlan?: NutritionPlan;
  populatedDatesData:DateData[] = []

  constructor(private accountService: AccountService, private fitnessPlanningService: NutritionPlanService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    // get the current user
    this.accountService.getCurrentUser()
    // get all fitness plans
    this.fitnessPlanningService.getAllNutritionPlans(this.accountService.user?.email!, this.accountService.user.authToken!).subscribe((res: any) => {
      this.allNutritionPlans = res
      // set current active plan
      this.setCurrentActivePlan()
    })
  }

  // Getters
  get dateData() {
    return this.nutritionPlanForm.get('dateData') as FormArray;
  }

  // Events
  onWeightChange(dateIdx: number, e: any){
    this.dateData.at(dateIdx).get('weight')?.setValue(Number(e.target.value));
    this.updatePopulatedDatesData()
  }

  onCaloriesChange(dateIdx: number, e: any){
    this.dateData.at(dateIdx).get('calories')?.setValue(Number(e.target.value));
    this.dateData.at(dateIdx).get('netcalories')?.setValue(Number(this.getNetCaloriesForDate(this.dateData.at(dateIdx).get('weight')?.value, this.dateData.at(dateIdx).get('calories')?.value)))
    this.updatePopulatedDatesData()
  }

  onNotesChange(dateIdx: number, e: any): void{
    this.dateData.at(dateIdx).get('notes')?.setValue(e.target.value);
  }

  onPlanDataSubmit(){
    let plan: NutritionData = this.nutritionPlanForm.value as NutritionData;
    this.sanitizePlan(plan);
    console.log(plan)
    this.fitnessPlanningService.submitNutritionData(plan);
  }

  viewGraphClicked(){
    this.router.navigateByUrl("/graph", {state: this.populatedDatesData})
  }

  // Setters
  setCurrentActivePlan(){
    // iterate over plans
    for( let plan of this.allNutritionPlans!){
      if (plan.status === 'active'){
        // if plan status is active, set it to currentActiveNutritionPlan
        this.currentActiveNutritionPlan = plan;
        // convert plan
        this.convertPlanDates()
      }
    }
  }

  setNetCalories(){
    let tdee = 0;
    let totalCals = 0;
    for(let dateObj of this.dateData.controls){
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
    let startDateStr = this.convertDateToString(this.currentActiveNutritionPlan?.startDate!);
    let endDateStr = this.convertDateToString(this.currentActiveNutritionPlan?.endDate!);
    let startDateObj = new Date(startDateStr);
    let endDateObj = new Date(endDateStr);
    let currentDate = startDateObj;
    let dateArray = [];
    while (startDateObj <= endDateObj){
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
    for(let data of this.currentActiveNutritionPlan?.nutritionData?.dateData!){
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

  createFormGroup(stringDate: string, populatedDates: DateData[]) {
    // create form group, for the particular date
    let group = this.createDateGroup(stringDate, populatedDates)
    // add it to dateData
    this.dateData.push(group);
  }

  updatePopulatedDatesData(){
    let tempArr = []
    this.netCalorieChange = 0
    for (let formData of this.dateData.value){
      if (formData.weight != 0 && formData.calories != 0){
        tempArr.push(formData)
        this.netCalorieChange += formData.netcalories
      }
    }
    console.log(tempArr,"TEMPARR")
    this.populatedDatesData = tempArr
  }

  createDateGroup(stringDate: string, populatedDates: DateData[]){
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

  sanitizePlan(plan: NutritionData){
    let newArr = []
    for(let i = 0; i <  plan.dateData.length; i++){
      let date = plan.dateData[i];
      if (date.weight !== 0)
      {
        newArr.push(date)
      }
    }
    plan.dateData = newArr
  }

  viewFitnessSummary() {
    this.fitnessPlanningService.getNutritionPlanSummary(this.accountService.user.email, this.accountService.user.authToken).subscribe((res) => console.log("SUMMARY",res))
  }
}
