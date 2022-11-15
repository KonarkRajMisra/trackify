import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LogInComponent} from './components/log-in/log-in.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { WorkoutRoutinePlanner } from './components/workout-routine-planner/workout-routine-planner.component';
import { NutritionProtocolPlanner } from './components/nutrition-protocol-planner/nutrition-protocol-planner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WeightTracker } from './components/weight-tracker/weight-tracker.component';
import { NutritionProtocolCards } from './components/nutrition-protocol-cards/nutrition-protocol-cards.component';
import { WeightGraph } from './graph/weight-graph.component';
import { MealPlanCardsComponent } from './components/meal-plan-cards/meal-plan-cards.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MealPlannerComponent } from './components/meal-planner/meal-planner.component';
import { SummaryComponent } from './components/summary/summary.component';
import { WorkoutSelectorComponent } from './components/workout-selector/workout-selector.component';
import { WorkoutPlannerCardsComponent } from './components/workout-planner-cards/workout-planner-cards.component';
import { WorkoutRoutineSelectorComponent } from './components/workout-routine-selector/workout-routine-selector.component';
import { WorkoutTrackerComponent } from './components/workout-tracker/workout-tracker.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    NavBarComponent,
    DashBoardComponent,
    HomeComponent,
    WorkoutRoutinePlanner,
    NutritionProtocolPlanner,
    WeightTracker,
    NutritionProtocolCards,
    WeightGraph,
    MealPlanCardsComponent,
    PaginationComponent,
    MealPlannerComponent,
    SummaryComponent,
    WorkoutSelectorComponent,
    WorkoutPlannerCardsComponent,
    WorkoutRoutineSelectorComponent,
    WorkoutTrackerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxPaginationModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
