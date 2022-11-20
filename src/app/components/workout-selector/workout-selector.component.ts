import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workout } from 'src/app/common/models/Workout/Workout';
import { WorkoutRoutine } from 'src/app/common/models/Workout/WorkoutRoutine';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { WorkoutService } from 'src/app/common/services/workout-service/workout.service';

@Component({
  selector: 'app-workout-selector',
  templateUrl: './workout-selector.component.html',
  styleUrls: ['./workout-selector.component.css']
})
export class WorkoutSelectorComponent implements OnInit {
  routineId: number | undefined
  routine: WorkoutRoutine | undefined
  constructor(private accountService: AccountService, private workoutService: WorkoutService, private router: Router) { 
    this.routineId = this.router.getCurrentNavigation()?.extras.state?.['routineId']
    console.log(this.routineId);
  }

  ngOnInit(): void {
    if (this.routineId != undefined) {
      this.workoutService.getWorkoutRoutine(this.routineId).subscribe((res) => {
      this.routine = res;
      console.log(this.routine)
      })
    }
  }

  trackWorkout(workout: Workout){
    this.router.navigateByUrl('/workoutTracker', { state: { workout: workout, routine: this.routine } })
  }

}
