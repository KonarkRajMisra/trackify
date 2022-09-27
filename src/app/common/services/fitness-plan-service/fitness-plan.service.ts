import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {FitnessPlan } from '../../models/FitnessPlan';
import { PlanData } from '../../models/PlanData';
import { User } from '../../models/User';
import { AccountService } from '../authentication-service/account-service.service';

@Injectable({
    providedIn: 'root'
})
export class FitnessPlanService{
    baseUrl = "https://localhost:7020/FitnessPlan/";

    constructor(private http: HttpClient, private accountService: AccountService){
        this.accountService.getCurrentUser()
    }

    createFitnessPlan(fitnessPlan: FitnessPlan)
    {
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        return this.http.post<User>(this.baseUrl + 'createFitnessPlan', fitnessPlan, options)
        .subscribe((res) => console.log(res));
    }

    getAllFitnessPlans(email: string, authToken: string)
    {
        let header = new HttpHeaders().set('Authorization', `Bearer ${authToken}`)
        let params = { "email": email };
        const options = {
            headers: header,
            params: params
        };
        return this.http.get<Array<FitnessPlan>>(this.baseUrl + 'getAllFitnessPlans', options);
    }

    getFitnessPlanSummary(email: string, authToken: string)
    {
        let header = new HttpHeaders().set('Authorization', `Bearer ${authToken}`)
        let params = { "email": email };
        const options = {
            headers: header,
            params: params
        };
        return this.http.get<any>(this.baseUrl + 'getFitnessPlanSummary', options);
    }

    submitFitnessPlanData(plan: PlanData){
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        plan.email = this.accountService.user.email
        console.log(plan);
        return this.http.post<User>(this.baseUrl + "submitFitnessPlanData", plan, options)
        .subscribe((res) => console.log(res));
    }

    deleteFitnessPlan(plan: FitnessPlan){
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header,
            body: plan
        }
        plan.email = this.accountService.user.email
        console.log(plan);
        return this.http.delete<User>(this.baseUrl + "deleteFitnessPlan", options)
        .subscribe((res) => console.log(res));
    }

    updateFitnessPlan(plan: FitnessPlan){
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        plan.email = this.accountService.user.email
        console.log(plan);
        return this.http.patch<User>(this.baseUrl + "updateFitnessPlan", plan, options)
        .subscribe((res) => console.log(res));
    }
}