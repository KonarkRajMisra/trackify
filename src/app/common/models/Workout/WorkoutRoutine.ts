import { Workout } from "./Workout";

export interface WorkoutRoutine{
    name: string | undefined,
    routineId: number | undefined,
    workouts: Array<Workout> | undefined;
}