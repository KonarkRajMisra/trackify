import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NutritionProtocol } from 'src/app/common/models/Nutrition/NutritionProtocol';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { NutritionProtocolService } from 'src/app/common/services/nutrition-protocol-service/nutrition-protocol.service';

@Component({
  selector: 'app-nutrition-protocol-cards',
  templateUrl: './nutrition-protocol-cards.component.html',
  styleUrls: ['./nutrition-protocol-cards.component.css']
})
export class NutritionProtocolCards implements OnInit {

  fitnessPlans: Array<NutritionProtocol> | undefined
  constructor(public accountService: AccountService, private nutritionProtocolService: NutritionProtocolService, private router: Router) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
    if (this.accountService.user != undefined) {
      this.nutritionProtocolService.getAllNutritionProtocols(this.accountService.user.email, this.accountService.user.authToken).subscribe((res: any) => {
        this.fitnessPlans = res;
        console.log("FITNESSPLANCARDCOMPONENT", this.fitnessPlans);
      })
    }
  }

  onEditProtocolClick(id: number, nutritionProtocol: NutritionProtocol) {
    this.router.navigateByUrl("/nutritionProtocol/" + id, { state: nutritionProtocol });
  }

  onCreateFitnessProtocolClick() {
    this.router.navigateByUrl("/nutritionProtocolPlanner");
  }

}
