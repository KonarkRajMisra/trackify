import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Exercise } from 'src/app/common/models/Workout/Exercise';
import { ExerciseSet } from 'src/app/common/models/Workout/ExerciseSet';
import { Workout } from 'src/app/common/models/Workout/Workout';
import { WorkoutRoutine } from 'src/app/common/models/Workout/WorkoutRoutine';
import { WorkoutService } from 'src/app/common/services/workout-service/workout.service';

@Component({
  selector: 'app-workout-planner',
  templateUrl: './workout-routine-planner.component.html',
  styleUrls: ['./workout-routine-planner.component.css']
})
export class WorkoutRoutinePlanner implements OnInit {

  workoutForm = this.fb.group({
    name: [''],
    routineId: [0],
    workouts: this.fb.array([])
  })

  activeRoutine: WorkoutRoutine | undefined;
  doesRoutineExist: boolean = false;

  constructor(private fb: FormBuilder, private workoutService: WorkoutService, private router: Router) {
    if (this.router.getCurrentNavigation()?.extras.state !== null) {
      console.log(this.router.getCurrentNavigation()?.extras.state);
      const routineId = this.router.getCurrentNavigation()?.extras.state?.['routineId'];
      if (routineId !== undefined && routineId !== null) {
        this.workoutService.getWorkoutRoutine(routineId).subscribe((res) => {
          this.activeRoutine = res;
          this.doesRoutineExist = true;
          // update form with activeRoutine
          this.workoutForm.patchValue({
            name: this.activeRoutine.name,
            routineId: this.activeRoutine.routineId,
          });
          this.activeRoutine.workouts?.forEach((workout) => {
            this.addCustomWorkout(workout);
          });
      })
    }
  }
  }

  ngOnInit(): void {
  }

  newWorkout(): FormGroup {
    return this.fb.group({
      workoutName: [''],
      exercises: this.fb.array([]),
    })
  }

  newExercise(): FormGroup {
    return this.fb.group({
      exerciseName: [''],
      exerciseHistory: this.fb.array([])
    })
  }


  get workouts(): FormArray {
    return this.workoutForm.get('workouts') as FormArray;
  }

  exercises(workoutIdx: number): FormArray {
    return this.workouts.at(workoutIdx).get('exercises') as FormArray;
  }

  addWorkout() {
    this.workouts.push(this.newWorkout());
  }

  addCustomWorkout(workout: Workout) {
    this.workouts.push(this.fb.group({
      workoutName: [workout.workoutName],
      exercises: this.fb.array(workout.exercises?.map((exercise) => {
        return this.fb.group({
          exerciseName: [exercise.exerciseName],
          exerciseHistory: this.fb.array([])
        })
      }
      ))
    }))
  }

  removeWorkout(workoutIdx: number) {
    this.workouts.removeAt(workoutIdx);
  }

  addExercise(workoutIdx: number) {
    this.exercises(workoutIdx).push(this.newExercise())
  }

  removeExercise(workoutIdx: number, exerciseIdx: number) {
    this.exercises(workoutIdx).removeAt(exerciseIdx);
  }

  saveWorkout() {
    console.log(this.workoutForm.value);
    const workoutRoutine = this.workoutForm.value as WorkoutRoutine;
    this.workoutService.createWorkoutRoutine(workoutRoutine);
  }

  updateWorkout(){
    const workoutRoutine = this.workoutForm.value as WorkoutRoutine;
    console.log(workoutRoutine);
    this.workoutService.updateWorkoutRoutine(workoutRoutine);
  }

  changeWorkoutName(e: any) {
    this.workoutForm.get('name')?.setValue(e.target.value);
  }
}
