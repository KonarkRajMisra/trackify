import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateData } from 'src/app/common/models/DateData';
import { NutritionProtocol } from 'src/app/common/models/Nutrition/NutritionProtocol';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { NutritionProtocolService } from 'src/app/common/services/nutrition-protocol-service/nutrition-protocol.service';
import { Date } from 'src/app/common/models/Date';
import { MealPlan } from 'src/app/common/models/MealPlan/MealPlan';
import { MealPlanService } from 'src/app/common/services/meal-plan-service/meal-plan.service';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  // Pagination lib properties
  title = 'pagination';
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  populatedDatesData?: DateData[];
  mealPlans?: MealPlan[];

  // Form group
  nutritionProtocolForm = this.fb.group({
    dateData: this.fb.array([])
  })

  netCaloriesPerDay = 0;
  plannedDates!: Array<globalThis.Date>;
  netCalorieChange?: number;

  // Weight Tracker Component 
  @Input() currentActiveNutritionProtocol?: NutritionProtocol;
  @Output() nutritionProtocolFormEvent = new EventEmitter<FormGroup<any>>();
  @Output() populatedDatesDataEvent = new EventEmitter<DateData[]>();
  @Output() weekEvent = new EventEmitter<number>();
  @Output() netCalorieChangeEvent = new EventEmitter<number>();

  constructor(private fb: FormBuilder, private nutritionProtocolService: NutritionProtocolService, private accountService: AccountService, private mealPlanService: MealPlanService) { }

  ngOnInit(): void {
    this.mealPlanService.getAllMealPlans().subscribe((res) => {
      this.mealPlans = res
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentActiveNutritionProtocol !== undefined) {
      this.convertPlanDates()
    }
  }

  // Logic
  convertPlanDates() {
    // convert date to string
    let startDateStr = this.convertDateToString(this.currentActiveNutritionProtocol?.startDate!);
    let endDateStr = this.convertDateToString(this.currentActiveNutritionProtocol?.endDate!);
    let startDateObj = new Date(startDateStr);
    let endDateObj = new Date(endDateStr);
    let currentDate = startDateObj;
    let dateArray = [];
    while (startDateObj <= endDateObj) {
      // populate all the dates within the plan
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // set plannedDates to populated dateArray
    this.plannedDates = dateArray;
    // convert plannedDates to Form Control
    this.convertPlanDatesToFormControl()
  }

  convertPlanDatesToFormControl() {
    // populate populatedDates
    let populatedDates = []
    for (let data of this.currentActiveNutritionProtocol?.nutritionData?.dateData!) {
      if (data.weight !== 0 || data.calories !== 0 || data.notes !== '') {
        populatedDates.push(data)
      }
    }
    // for each date, create date string, and create Form group
    for (let date of this.plannedDates) {
      this.createFormGroup(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, populatedDates)
    }
    this.updatePopulatedDatesData()
  }

  // Iterate over form's dateData, if it's populated by user input
  // add the data to populatedDatesData
  updatePopulatedDatesData(): void {
    let tempArr = []
    let sumOfCalChange = 0
    for (let formData of this.dateData.value) {
      if (formData.weight != 0 && formData.calories != 0) {
        tempArr.push(formData)
        sumOfCalChange += formData.netcalories
      }
    }
    this.netCalorieChange = sumOfCalChange;
    this.populatedDatesData = tempArr
    this.count = this.dateData.length
    this.sendEventToParent()
  }

  // Pagination Event Emitters
  onTableDataChange(event: any) {
    this.page = event;
    this.emitWeekChange(this.page);
    console.log()
  }

  emitNutritionProtocolEvent(value: FormGroup<any>) {
    this.nutritionProtocolFormEvent.emit(value);
  }

  emitPopulatedDatesEvent(value: DateData[]) {
    this.populatedDatesDataEvent.emit(value);
  }

  emitWeekChange(value: number) {
    this.weekEvent.emit(value);
  }

  emitNetCalorieChange(value: number) {
    this.netCalorieChangeEvent.emit(value);
  }

  sendEventToParent() {
    this.emitNutritionProtocolEvent(this.nutritionProtocolForm);
    this.emitPopulatedDatesEvent(this.populatedDatesData!);
    this.emitNetCalorieChange(this.netCalorieChange!);
  }

  // Getters
  get dateData() {
    return this.nutritionProtocolForm.get('dateData') as FormArray;
  }

  createFormGroup(stringDate: string, populatedDates: DateData[]) {
    // create form group, for the particular date
    let group = this.createDateGroup(stringDate, populatedDates)
    // add it to dateData
    this.dateData.push(group);
  }

  // Events
  onWeightChange(dateIdx: number, e: any) {
    this.dateData.at(dateIdx).get('weight')?.setValue(Number(e.target.value));
    this.updatePopulatedDatesData()
  }

  onCaloriesChange(dateIdx: number, e: any) {
    console.log(Number(e))
    if (!isNaN(Number(e))){
      e = e
    }
    else{
      e = e.target.value
    }
    this.dateData.at(dateIdx).get('calories')?.setValue(Number(e));
    this.dateData.at(dateIdx).get('netcalories')?.setValue(Number(this.getNetCaloriesForDate(this.dateData.at(dateIdx).get('weight')?.value, this.dateData.at(dateIdx).get('calories')?.value)))
    this.updatePopulatedDatesData()
  }

  onNotesChange(dateIdx: number, e: any): void {
    this.dateData.at(dateIdx).get('notes')?.setValue(e.target.value);
  }

  // Go over dateData, if weight and calories are set, update totalCals
  // update netCalories for the day
  setNetCalories() {
    let tdee = 0;
    let totalCals = 0;
    for (let dateObj of this.dateData.controls) {
      if (dateObj.get('weight')?.value !== 0 && dateObj.get('calories')?.value !== 0) {
        tdee = Number(dateObj.get('weight')?.value) * 15;
        totalCals -= tdee - Number(dateObj.get('calories')?.value)
      }
      else {
        break;
      }
    }
    this.netCaloriesPerDay = totalCals;
  }

  // Get net calories diff for the day
  getNetCaloriesForDate(weight: number, calories: number): number {
    let tdee = weight * 15;
    let netCals = calories - tdee;
    return netCals
  }

  createDateGroup(stringDate: string, populatedDates: DateData[]) {
    // Check if date has already been filled by user, if so return populated vals
    for (let populatedDate of populatedDates) {
      if (populatedDate.date === stringDate) {
        let newDate = this.fb.group({
          date: this.fb.control(stringDate),
          weight: this.fb.control(populatedDate.weight),
          calories: this.fb.control(populatedDate.calories),
          netcalories: this.fb.control(this.getNetCaloriesForDate(populatedDate.weight, populatedDate.calories)),
          notes: this.fb.control(populatedDate.notes),
          mealPlanFollowed: this.fb.control(populatedDate.mealPlanFollowed)
        })
        this.populatedDatesData?.push(populatedDate);
        return newDate
      }
    }

    // Otherwise, create a blank group
    let newDate = this.fb.group({
      date: this.fb.control(stringDate),
      weight: this.fb.control(0),
      calories: this.fb.control(0),
      netcalories: this.fb.control(this.netCaloriesPerDay),
      notes: this.fb.control(''),
      mealPlanFollowed: this.fb.control(false)
    })
    return newDate;
  }

  convertDateToString(date: Date) {
    let stringDate = date.year + "-" + date.month + "-" + date.day;
    return stringDate;
  }

  generateIndex(i: number) {
    return this.tableSize * (this.page - 1) + i;
  }

  onMealPlanChange(idx: number, e: any) {
    if (e.target.value != "default"){
      this.dateData.at(idx).get('mealPlanFollowed')?.setValue(true)
      this.onCaloriesChange(idx, e.target.value)
    }
  }
}
