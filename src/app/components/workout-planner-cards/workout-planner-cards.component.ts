import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutRoutine } from 'src/app/common/models/Workout/WorkoutRoutine';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { WorkoutService } from 'src/app/common/services/workout-service/workout.service';

@Component({
  selector: 'app-workout-planner-cards',
  templateUrl: './workout-planner-cards.component.html',
  styleUrls: ['./workout-planner-cards.component.css']
})
export class WorkoutPlannerCardsComponent implements OnInit {

  workoutRoutines: Array<WorkoutRoutine> | undefined

  constructor(private accountService: AccountService, private workoutService: WorkoutService, private router: Router) {
    this.workoutService.getWorkoutRoutines().subscribe((res) => {
      this.workoutRoutines = res;
    })

  }

  ngOnInit(): void {
  }

  editWorkoutRoutine(routineId: number): void {
    // send routineId to workoutRoutinePlanner
    this.router.navigateByUrl('/workoutRoutinePlanner', { state: { routineId: routineId } })
  }

  createRoutine(){
    this.router.navigateByUrl('/workoutRoutinePlanner')
  }

  deleteWorkoutRoutine(routineId: number): void {
    this.workoutService.deleteWorkoutRoutine(routineId).subscribe((res) => {
      console.log(res);
    })
  }

}
