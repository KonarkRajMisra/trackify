import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { HomeComponent } from './components/home/home.component';
import { FitnessPlanner } from './components/nutrition-planner/nutrition-planner.component';
import { WeightTracker } from './components/weight-tracker/weight-tracker.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { FitnessPlanCardsComponent } from './components/fitness-plan-cards/fitness-plan-cards.component';
import { GraphComponent } from './graph/graph.component';



const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "fitnessPlanCards", component: FitnessPlanCardsComponent},
  {path: "nutritionPlan", component: FitnessPlanner},
  {path: "nutritionPlan/:id", component: FitnessPlanner},
  {path: "weightTracking", component: WeightTracker},
  {path: "dash", component: DashBoardComponent},
  {path: "login", component: LogInComponent},
  {path: "graph", component: GraphComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
