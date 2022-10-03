import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {NutritionPlan } from '../../models/Nutrition/NutritionPlan';
import { NutritionData } from '../../models/Nutrition/NutritionData';
import { User } from '../../models/User/User';
import { AccountService } from '../authentication-service/account-service.service';

@Injectable({
    providedIn: 'root'
})
export class NutritionPlanService{
    
    baseUrl = "https://localhost:7020/NutritionPlan/";

    constructor(private http: HttpClient, private accountService: AccountService){
        this.accountService.getCurrentUser()
    }

    createNutritionPlan(nutritionPlan: NutritionPlan)
    {
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        return this.http.post<User>(this.baseUrl + 'createNutritionPlan', nutritionPlan, options)
        .subscribe((res) => console.log(res));
    }

    getAllNutritionPlans(email: string, authToken: string)
    {
        let header = new HttpHeaders().set('Authorization', `Bearer ${authToken}`)
        let params = { "email": email };
        const options = {
            headers: header,
            params: params
        };
        return this.http.get<Array<NutritionPlan>>(this.baseUrl + 'getAllNutritionPlans', options);
    }

    getNutritionPlanSummary(email: string, authToken: string)
    {
        let header = new HttpHeaders().set('Authorization', `Bearer ${authToken}`)
        let params = { "email": email };
        const options = {
            headers: header,
            params: params
        };
        return this.http.get<any>(this.baseUrl + 'getNutritionPlanSummary', options);
    }

    submitNutritionData(nutritionData: NutritionData){
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        nutritionData.email = this.accountService.user.email
        console.log(nutritionData);
        return this.http.post<User>(this.baseUrl + "submitNutritionPlanData", nutritionData, options)
        .subscribe((res) => console.log(res));
    }

    deleteNutritionPlan(plan: NutritionPlan){
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header,
            body: plan
        }
        plan.email = this.accountService.user.email
        console.log(plan);
        return this.http.delete<User>(this.baseUrl + "deleteNutritionPlan", options)
        .subscribe((res) => console.log(res));
    }

    updateNutritionPlan(plan: NutritionPlan){
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        plan.email = this.accountService.user.email
        console.log(plan);
        return this.http.patch<User>(this.baseUrl + "updateNutritionPlan", plan, options)
        .subscribe((res) => console.log(res));
    }
}