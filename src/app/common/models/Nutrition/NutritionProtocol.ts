import { Date } from "../Date"
import { NutritionData } from "./NutritionData"
export interface NutritionProtocol{
    email: string,
    protocolId: number,
    startingWeight: number,
    goalWeight: number,
    protocolName: string,
    startDate: Date,
    endDate: Date,
    protocolCalories: number,
    status: string,
    nutritionData: NutritionData | null
}