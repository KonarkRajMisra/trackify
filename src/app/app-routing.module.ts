import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { HomeComponent } from './components/home/home.component';
import { NutritionProtocolPlanner } from './components/nutrition-protocol-planner/nutrition-protocol-planner.component';
import { WeightTracker } from './components/weight-tracker/weight-tracker.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { NutritionProtocolCards } from './components/nutrition-protocol-cards/nutrition-protocol-cards.component';
import { WeightGraph } from './graph/weight-graph.component';
import { AuthGuard } from './common/guards/auth.guard';
import { MealPlanCardsComponent } from './components/meal-plan-cards/meal-plan-cards.component';
import { MealPlannerComponent } from './components/meal-planner/meal-planner.component';
import { SummaryComponent } from './components/summary/summary.component';



const routes: Routes = [
  {path: "", component: HomeComponent, canActivate: [AuthGuard]},
  {path: "nutritionProtocolCards", component: NutritionProtocolCards, canActivate: [AuthGuard]},
  {path: "createNutritionProtocolCard", component: NutritionProtocolPlanner, canActivate: [AuthGuard]},
  {path: "mealPlanCards", component: MealPlanCardsComponent, canActivate: [AuthGuard]},
  {path: "mealPlan", component: MealPlannerComponent, canActivate: [AuthGuard]},
  {path: "mealPlan/:id", component: MealPlannerComponent, canActivate: [AuthGuard]},
  {path: "nutritionProtocol/:id", component: NutritionProtocolPlanner, canActivate: [AuthGuard]},
  {path: "weightTracking", component: WeightTracker, canActivate: [AuthGuard]},
  {path: "dash", component: DashBoardComponent, canActivate: [AuthGuard]},
  {path: "login", component: LogInComponent},
  {path: "graph", component: WeightGraph, canActivate: [AuthGuard]},
  {path: "summary", component: SummaryComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
