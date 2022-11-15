import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workout } from 'src/app/common/models/Workout/Workout';
import { WorkoutRoutine } from 'src/app/common/models/Workout/WorkoutRoutine';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { WorkoutService } from 'src/app/common/services/workout-service/workout.service';

@Component({
  selector: 'app-workout-routine-selector',
  templateUrl: './workout-routine-selector.component.html',
  styleUrls: ['./workout-routine-selector.component.css']
})
export class WorkoutRoutineSelectorComponent implements OnInit {

  workoutRoutines: Array<WorkoutRoutine> | undefined
  constructor(private accountService: AccountService, private workoutService: WorkoutService, private router: Router) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
    this.workoutService.getWorkoutRoutines().subscribe((res) => {  
      this.workoutRoutines = res;
    })
  }

  trackWorkoutRoutine(routineId: number){
    this.router.navigateByUrl('/workoutSelector', { state: { routineId: routineId } })
  }
}
