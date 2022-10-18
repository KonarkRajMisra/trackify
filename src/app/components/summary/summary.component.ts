import { Component, OnInit } from '@angular/core';
import { NutritionSummary } from 'src/app/common/models/Summary/NutritionSummary';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { NutritionProtocolService } from 'src/app/common/services/nutrition-protocol-service/nutrition-protocol.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  summary?: NutritionSummary
  constructor(private accountService: AccountService, private nutritionProtocolService: NutritionProtocolService) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser()
    this.nutritionProtocolService.getNutritionProtocolSummary(this.accountService.user.email, this.accountService.user.authToken).subscribe(
      (res) => this.summary = res as NutritionSummary)
  }

}
