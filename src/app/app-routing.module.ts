import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { HomeComponent } from './components/home/home.component';
import { FitnessPlanner } from './components/fitness-planner/fitness-planner.component';
import { WeightTracker } from './components/weight-tracker/weight-tracker.component';
import { LogInComponent } from './components/log-in/log-in.component';


const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "fitnessPlanning", component: FitnessPlanner},
  {path: "weightTracking", component: WeightTracker},
  {path: "dash", component: DashBoardComponent},
  {path: "login", component: LogInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
