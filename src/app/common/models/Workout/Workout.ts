import { Exercise } from "./Exercise";

export interface Workout {
    workoutName: string,
    exercises: Array<Exercise>
}