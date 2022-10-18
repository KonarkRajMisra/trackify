import { Food } from "./Food";

export interface MealPlan{
    mealPlanId: number,
    mealPlanName: string,
    mealPlanCalories: number,
    meals: Array<Food>
}