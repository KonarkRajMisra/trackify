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
import { TemplateFormComponent } from './components/template-form/template-form.component';
import { NutritionProtocolPlanner } from './components/nutrition-protocol-planner/nutrition-protocol-planner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WeightTracker } from './components/weight-tracker/weight-tracker.component';
import { NutritionProtocolCards } from './components/nutrition-protocol-cards/nutrition-protocol-cards.component';
import { GraphComponent } from './graph/graph.component';
import { MealPlanCardsComponent } from './components/meal-plan-cards/meal-plan-cards.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MealPlannerComponent } from './components/meal-planner/meal-planner.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    NavBarComponent,
    DashBoardComponent,
    HomeComponent,
    TemplateFormComponent,
    NutritionProtocolPlanner,
    WeightTracker,
    NutritionProtocolCards,
    GraphComponent,
    MealPlanCardsComponent,
    PaginationComponent,
    MealPlannerComponent
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
