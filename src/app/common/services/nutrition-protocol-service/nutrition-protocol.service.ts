import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NutritionProtocol } from '../../models/Nutrition/NutritionProtocol';
import { NutritionData } from '../../models/Nutrition/NutritionData';
import { User } from '../../models/User/User';
import { AccountService } from '../authentication-service/account-service.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NutritionProtocolService {

    baseUrl = "https://localhost:7020/NutritionProtocol/";

    constructor(private http: HttpClient, private accountService: AccountService) {
        this.accountService.getCurrentUser()
    }

    createNutritionProtocol(nutritionProtocol: NutritionProtocol) {
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        return this.http.post<User>(this.baseUrl + 'createNutritionProtocol', nutritionProtocol, options)
            .subscribe((res) => console.log(res));
    }

    getAllNutritionProtocols(email: string, authToken: string): Observable<Array<NutritionProtocol>> {
        let header = new HttpHeaders().set('Authorization', `Bearer ${authToken}`)
        let params = { "email": email };
        const options = {
            headers: header,
            params: params
        };
        return this.http.get<Array<NutritionProtocol>>(this.baseUrl + 'getAllNutritionProtocols', options);
    }

    getNutritionProtocolSummary(email: string, authToken: string) {
        let header = new HttpHeaders().set('Authorization', `Bearer ${authToken}`)
        let params = { "email": email };
        const options = {
            headers: header,
            params: params
        };
        return this.http.get<any>(this.baseUrl + 'getNutritionProtocolSummary', options);
    }

    submitNutritionData(nutritionData: NutritionData) {
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        nutritionData.email = this.accountService.user.email
        console.log(nutritionData);
        return this.http.post<User>(this.baseUrl + "submitNutritionProtocolData", nutritionData, options)
            .subscribe((res) => console.log(res));
    }

    deleteNutritionProtocol(protocol: NutritionProtocol) {
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header,
            body: protocol
        }
        protocol.email = this.accountService.user.email
        console.log(protocol);
        return this.http.delete<User>(this.baseUrl + "deleteNutritionProtocol", options)
            .subscribe((res) => console.log(res));
    }

    updateNutritionProtocol(protocol: NutritionProtocol) {
        let header = new HttpHeaders().set('Authorization', `Bearer ${this.accountService.user.authToken}`)
        const options = {
            headers: header
        }
        protocol.email = this.accountService.user.email
        console.log(protocol);
        return this.http.patch<User>(this.baseUrl + "updateNutritionProtocol", protocol, options)
            .subscribe((res) => console.log(res));
    }
}