import { WorkoutRoutine } from "../Workout/WorkoutRoutine";
import { NutritionProtocol } from "../Nutrition/NutritionProtocol";
import { MealPlan } from "../MealPlan/MealPlan";
export interface User{
    name: string,
    email: string,
    picture: string,
    authToken: string,
    workoutRoutines: Array<WorkoutRoutine>,
    mealPlans: Array<MealPlan>,
    nutritionProtocols: Array<NutritionProtocol>,
    firstTimeUser: boolean
}