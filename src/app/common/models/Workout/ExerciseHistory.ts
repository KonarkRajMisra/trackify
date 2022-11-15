import { ExerciseSet } from "./ExerciseSet";

export interface ExerciseHistory{
    date: string,
    exerciseSets: Array<ExerciseSet>
}