import { Component, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Workout } from 'src/app/common/models/Workout/Workout';
import { WorkoutRoutine } from 'src/app/common/models/Workout/WorkoutRoutine';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { WorkoutService } from 'src/app/common/services/workout-service/workout.service';

@Component({
  selector: 'app-workout-tracker',
  templateUrl: './workout-tracker.component.html',
  styleUrls: ['./workout-tracker.component.css']
})
export class WorkoutTrackerComponent implements OnInit {
  title = 'Workout Tracker';
  page: number = 1;
  count: number = 0;
  tableSize: number = 4;
  routine: WorkoutRoutine | undefined;
  workout: Workout | undefined;
  workoutForm: FormGroup = this.fb.group({
    workoutName: [''],
    exercises: this.fb.array([])
  })

  monthEvent = new EventEmitter<number>();

  constructor(private accountService: AccountService, private workoutService: WorkoutService, private router: Router, private fb: FormBuilder) {
    this.routine = this.router.getCurrentNavigation()?.extras.state?.['routine'];
    this.workout = this.router.getCurrentNavigation()?.extras.state?.['workout']
    console.log(this.workout, "WORKOUT");
    console.log(this.routine, "ROUTINE");
  }

  ngOnInit(): void {
    this.updateFormWithWorkout(this.workout!);
  }

  addDate() {
  }

  updateFormWithWorkout(workout: Workout) {
    this.workoutForm?.patchValue({
      workoutName: workout.workoutName,
    })
    workout.exercises.forEach((exercise, exerciseIdx) => {
      this.exercises.push(this.fb.group({
        exerciseName: exercise.exerciseName,
        exerciseHistory: this.fb.array([]),
      })
      )
      exercise.exerciseHistory.forEach((history, exerciseHistIdx) => {
        this.exerciseHistory(exerciseIdx).push(this.fb.group({
          date: history.date,
          exerciseSets: this.fb.array([])
        }))
        history.exerciseSets.forEach((exerciseSet, exerciseSetIdx) => {
          this.exerciseSets(exerciseIdx, exerciseHistIdx).push(this.fb.group({
            weight: exerciseSet.weight,
            reps: exerciseSet.reps,
            notes: exerciseSet.notes
          }))
        })
      })
    })
    console.log(this.workoutForm, "postupdate")
  }

  get exercises(): FormArray {
    return this.workoutForm?.get('exercises') as FormArray;
  }

  exerciseHistory(exerciseIndex: number): FormArray {
    return this.exercises.at(exerciseIndex).get('exerciseHistory') as FormArray;
  }

  exerciseSets(exerciseIndex: number, exerciseHistoryIndex: number): FormArray {
    return this.exerciseHistory(exerciseIndex).at(exerciseHistoryIndex).get('exerciseSets') as FormArray;
  }

  addExerciseDate(exerciseIdx: number) {
    this.exerciseHistory(exerciseIdx).push(this.fb.group({
      date: [''],
      exerciseSets: this.fb.array([
        this.fb.group({
          weight: [''],
          reps: [''],
          notes: [' ']
        })
      ])
    }))
    this.count = this.exerciseHistory(exerciseIdx).controls.length;
  }

  addExerciseSet(exerciseIdx: number, exerciseHistIdx: number) {
    this.exerciseSets(exerciseIdx, exerciseHistIdx).push(this.fb.group({
      weight: [''],
      reps: [''],
      notes: ['']
    }))
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  saveWorkout() {
    const workout = this.workoutForm.value as Workout;
    this.routine?.workouts?.forEach((w, i) => {
      if (w.workoutName === workout.workoutName) {
        this.routine!.workouts![i] = workout
        return;
      }
    })
    console.log(this.routine, "ROUTINETOSAVE")
    this.workoutService.updateWorkoutRoutine(this.routine!)
  }

  generateIndex(i: number) {
    console.log(this.tableSize * (this.page - 1) + i, "INDEX")
    return this.tableSize * (this.page - 1) + i;
  }

  isExerciseHistoryNonNull(exerciseIdx: number): boolean {
    return this.exerciseHistory(exerciseIdx) !== null
      && this.exerciseHistory(exerciseIdx) !== undefined
      && this.exerciseHistory(exerciseIdx).length > 0
  }

  isExerciseDateNonNull(exerciseIdx: number, exerciseHistoryIdx: number): boolean {
    return this.exerciseHistory(exerciseIdx).at(exerciseHistoryIdx).get('date') !== null
      && this.exerciseHistory(exerciseIdx).at(exerciseHistoryIdx).get('date') !== undefined
  }

  isExerciseSetsNonNull(exerciseIdx: number, exerciseHistoryIdx: number): boolean {
    return this.exerciseSets(exerciseIdx, exerciseHistoryIdx) !== null
      && this.exerciseSets(exerciseIdx, exerciseHistoryIdx) !== undefined
      && this.exerciseSets(exerciseIdx, exerciseHistoryIdx).length > 0
  }
}
