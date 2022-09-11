import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { HomeComponent } from './components/home/home.component';
import { FitnessPlanner } from './components/fitness-planner/fitness-planner.component';
import { WeightTracker } from './components/weight-tracker/weight-tracker.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { FitnessPlanCardsComponent } from './components/fitness-plan-cards/fitness-plan-cards.component';



const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "fitnessPlanCards", component: FitnessPlanCardsComponent},
  {path: "fitnessPlan", component: FitnessPlanner},
  {path: "fitnessPlan/:id", component: FitnessPlanner},
  {path: "weightTracking", component: WeightTracker},
  {path: "dash", component: DashBoardComponent},
  {path: "login", component: LogInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
