import { Component, OnInit } from '@angular/core';
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
  constructor(private accountService: AccountService, private workoutService: WorkoutService) {
    this.workoutService.getWorkoutRoutines().subscribe((res) => {
      this.workoutRoutines = res;
    })

  }

  ngOnInit(): void {
  }

  editWorkoutRoutine(routineId: number): void {

  }

  createRoutine(){

  }

}
