import { Component, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Workout } from 'src/app/common/models/Workout/Workout';
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
  workout: Workout | undefined;
  workoutForm: FormGroup = this.fb.group({
    workoutName: [''],
    exercises: this.fb.array([])
  })

  monthEvent = new EventEmitter<number>();

  constructor(private accountService: AccountService, private workoutService: WorkoutService, private router: Router, private fb: FormBuilder) {
    this.workout = this.router.getCurrentNavigation()?.extras.state?.['workout']    
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
      exercise.exerciseHistory.forEach((exerciseHistory, exerciseHistIdx) => {
        this.exerciseHistory(exerciseIdx).push(this.fb.group({
          date: exerciseHistory.date,
          exerciseSets: exerciseHistory.exerciseSets.forEach((exerciseSet, exerciseSetIdx) => {
            this.exerciseSets(exerciseIdx, exerciseHistIdx).push(this.fb.group({
              weight: exerciseSet.weight,
              reps: exerciseSet.reps,
              notes: exerciseSet.notes
            }))
          })
        }))
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

  addExerciseDate(exerciseIdx: number){
    this.exerciseHistory(exerciseIdx).push(this.fb.group({
      date: [''],
      exerciseSets: this.fb.array([
        this.fb.group({
        weight: [''],
        reps: [''],
        notes: ['']
        })
      ])
    }))
    console.log(this.exercises, "EXERCISES")
  }

  addExerciseSet(exerciseIdx: number, exerciseHistIdx: number) {
    this.exerciseSets(exerciseIdx, exerciseHistIdx).push(this.fb.group({
      weight: [''],
      reps: [''],
      notes: ['']
    }))
  }

  onTableDataChange(event: any){
    this.page = event;
    this.emitMonthChange(this.page);
  }

  emitMonthChange(value: number){
    this.monthEvent.emit(value);
  }

  generateIndex(i: number){
    return this.tableSize * (this.page - 1) + i;
  }

  isExerciseHistoryNonNull(exerciseIdx : number): boolean {
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
