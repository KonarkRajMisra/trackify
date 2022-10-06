import { Meal } from "./Meal";

export interface MealPlan{
    mealPlanName: string,
    mealPlanCalories: number,
    meals: Array<Meal>
}