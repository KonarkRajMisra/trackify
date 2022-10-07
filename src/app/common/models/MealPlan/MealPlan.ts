import { Food } from "./Food";

export interface MealPlan{
    mealPlanName: string,
    mealPlanCalories: number,
    meals: Array<Food>
}