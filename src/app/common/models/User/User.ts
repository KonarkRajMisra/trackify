import { WorkoutRoutine } from "../Workout/WorkoutRoutine";
import { NutritionPlan } from "../Nutrition/NutritionPlan";
export interface User{
    name: string,
    email: string,
    picture: string,
    authToken: string,
    workoutRoutines: Array<WorkoutRoutine>,
    nutritionPlans: Array<NutritionPlan>,
    firstTimeUser: boolean
}