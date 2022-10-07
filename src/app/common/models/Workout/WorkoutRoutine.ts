import { Workout } from "./Workout";

export interface WorkoutRoutine{
    routineName: string | undefined,
    workouts: Array<Workout> | undefined;
}