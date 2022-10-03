import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { HomeComponent } from './components/home/home.component';
import { NutritionPlanner } from './components/nutrition-planner/nutrition-planner.component';
import { WeightTracker } from './components/weight-tracker/weight-tracker.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { NutritionPlanCards } from './components/nutrition-plan-cards/nutrition-plan-cards.component';
import { GraphComponent } from './graph/graph.component';
import { AuthGuard } from './common/guards/auth.guard';



const routes: Routes = [
  {path: "", component: HomeComponent, canActivate: [AuthGuard]},
  {path: "nutritionPlanCards", component: NutritionPlanCards, canActivate: [AuthGuard]},
  {path: "nutritionPlan", component: NutritionPlanner, canActivate: [AuthGuard]},
  {path: "nutritionPlan/:id", component: NutritionPlanner, canActivate: [AuthGuard]},
  {path: "weightTracking", component: WeightTracker, canActivate: [AuthGuard]},
  {path: "dash", component: DashBoardComponent, canActivate: [AuthGuard]},
  {path: "login", component: LogInComponent},
  {path: "graph", component: GraphComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
