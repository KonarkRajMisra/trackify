import { DateData } from "../DateData"
import { NutritionSummary } from "../Summary/NutritionSummary"

export interface NutritionData{
    email: string
    dateData: Array<DateData>
    summaryData: NutritionSummary | null
}