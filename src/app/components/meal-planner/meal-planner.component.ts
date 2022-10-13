import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
  existingPlan: boolean = false;
  mealPlan: MealPlan | undefined
  mealPlanForm = this.fb.group({
    mealPlanName: [''],
    mealPlanCalories: [0],
    meals: this.fb.array([])
  })

  totalMealPlanCals: number = 0;

  constructor(private fb: FormBuilder, private accountService: AccountService, private mealPlanService: MealPlanService, private router: Router) { 
    this.mealPlan = this.router.getCurrentNavigation()?.extras.state as MealPlan
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
    if (this.mealPlan != undefined)
    {
      this.existingPlan = true
      this.updateFormWithExistingValues()
    }
  }

  updateFormWithExistingValues(){
    this.mealPlanForm.patchValue({
      mealPlanName: this.mealPlan?.mealPlanName,
      mealPlanCalories: this.mealPlan?.mealPlanCalories,
      
    })
    for (let m of this.mealPlan?.meals!){
      this.createMeal(m.name, m.calories, m.protein, m.carbohydrates, m.fats)
    }
    console.log(this.mealPlanForm)
    console.log(this.mealPlan)
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

  createMeal(name: string, calories: number, protein: number, carbohydrates: number, fats: number): void{
    this.meals.push(this.mealWithVals(name, calories, protein, carbohydrates, fats))
  }

  mealWithVals(name: string, calories: number, protein: number, carbohydrates: number, fats: number): FormGroup{
    return this.fb.group({
      name: [name],
      calories: [calories],
      protein: [protein],
      carbohydrates: [carbohydrates],
      fats: [fats]
    })
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
      mealPlanId: 0,
      mealPlanName: this.mealPlanForm.get('mealPlanName')?.value!,
      mealPlanCalories: this.mealPlanForm.get('mealPlanCalories')?.value!,
      meals: this.meals.value as Food[]
    }
    console.log(mealPlan)
    this.mealPlanService.createMealPlan(mealPlan);
  }

  deleteMealPlan(){
    console.log(this.mealPlan, "DELETE");
    this.mealPlanService.deleteMealPlan(this.mealPlan!);
  }

}
