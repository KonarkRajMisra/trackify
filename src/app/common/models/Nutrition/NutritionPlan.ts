import { Date } from "../Date"
import { NutritionData } from "./NutritionData"
export interface NutritionPlan{
    email: string,
    planId: number,
    startingWeight: number,
    goalWeight: number,
    planName: string,
    startDate: Date,
    endDate: Date,
    planCalories: number,
    status: string,
    nutritionData: NutritionData | null
}