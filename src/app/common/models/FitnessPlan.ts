import { Date } from "./Date"
import { PlanData } from "./PlanData"
export interface FitnessPlan{
    email: string,
    planId: number,
    currentWeight: number,
    currentPlan: string,
    currentDate: Date,
    planEndDate: Date,
    currentPlanCalories: number,
    status: string,
    planData: PlanData | null
}