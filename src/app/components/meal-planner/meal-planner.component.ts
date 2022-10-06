import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';

@Component({
  selector: 'app-meal-planner',
  templateUrl: './meal-planner.component.html',
  styleUrls: ['./meal-planner.component.css']
})
export class MealPlannerComponent implements OnInit {

  mealPlanForm = this.fb.group({
    mealPlanName: [''],
    mealPlanCalories: [0],
    meals: this.fb.array([])
  })

  totalMealPlanCals: number = 0;

  constructor(private fb: FormBuilder, private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
  }

  get meals(): FormArray {
    return this.mealPlanForm.get('meals') as FormArray;
  }

  meal(mealIdx: number): FormGroup {
    return this.meals.at(mealIdx) as FormGroup
  }

  createNewMeal(): void{
    this.meals.push(this.newMeal())
  }

  newMeal(): FormGroup{
    return this.fb.group({
      name: [''],
      calories: [0],
      protein: [0]
    })
  }

  removeMeal(mealIdx: number): void {
    this.meals.removeAt(mealIdx);
  }

  changeMealPlanName(event: any){
    this.mealPlanForm.controls.mealPlanName.patchValue(event.target.value);
  }

  onMealNameChange(event: any, mealIdx: number){
    this.meal(mealIdx).controls['name'].patchValue(event.target.value)
    console.log(this.meal(mealIdx))
  }

  onMealCaloriesChange(event: any, mealIdx: number){
    this.meal(mealIdx).controls['calories'].patchValue(Number(event.target.value))
    this.totalMealPlanCals += Number(event.target.value)
    console.log(this.meal(mealIdx))
  }

  onMealProteinChange(event: any, mealIdx: number){
    this.meal(mealIdx).controls['protein'].patchValue(Number(event.target.value))
    console.log(this.meal(mealIdx))
  }

  saveMealPlan(){
    
  }

}
