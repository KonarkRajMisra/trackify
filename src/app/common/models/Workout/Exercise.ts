import { ExerciseSet } from "./ExerciseSet";

export interface Exercise{
    exerciseName: string,
    exerciseSets: Array<ExerciseSet>,
    date: string
}