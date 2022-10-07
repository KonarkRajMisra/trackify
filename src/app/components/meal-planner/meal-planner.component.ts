import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Food } from 'src/app/common/models/MealPlan/Food';
import { MealPlan } from 'src/app/common/models/MealPlan/MealPlan';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { MealPlanService } from 'src/app/common/services/meal-plan-service/meal-plan.service';

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

  constructor(private fb: FormBuilder, private accountService: AccountService, private mealPlanService: MealPlanService) { }

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
      protein: [0],
      carbohydrates: [0],
      fats: [0]
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
    this.mealPlanForm.controls.mealPlanCalories.patchValue(this.totalMealPlanCals);
    console.log(this.meal(mealIdx))
  }

  onMealProteinChange(event: any, mealIdx: number){
    this.meal(mealIdx).controls['protein'].patchValue(Number(event.target.value))
    console.log(this.meal(mealIdx))
  }

  saveMealPlan(){
    console.log(this.mealPlanForm);
    const mealPlan: MealPlan = {
      mealPlanName: this.mealPlanForm.get('mealPlanName')?.value!,
      mealPlanCalories: this.mealPlanForm.get('mealPlanCalories')?.value!,
      meals: this.meals.value as Food[]
    }
    console.log(mealPlan)
    this.mealPlanService.createMealPlan(mealPlan);
  }

}
