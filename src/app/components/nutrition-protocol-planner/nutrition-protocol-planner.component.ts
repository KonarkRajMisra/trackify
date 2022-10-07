import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/common/services/authentication-service/account-service.service';
import { NutritionProtocolService } from 'src/app/common/services/nutrition-protocol-service/nutrition-protocol.service';
import { checkIfNumber } from 'src/app/common/util/checkIfNumber';
import { NutritionProtocol } from 'src/app/common/models/Nutrition/NutritionProtocol';
import { Date } from 'src/app/common/models/Date';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NutritionData } from 'src/app/common/models/Nutrition/NutritionData';
@Component({
  selector: 'app-nutrition-protocol-planner',
  templateUrl: './nutrition-protocol-planner.component.html',
  styleUrls: ['./nutrition-protocol-planner.component.css']
})
export class NutritionProtocolPlanner implements OnInit {
  nutritionProtocol: NutritionProtocol | undefined;
  editProtocol: boolean = false;
  faCalendar = faCalendar;
  tdee = 0;
  protocolCalories = 0;
  protocols = [
    {
      name: 'Aggressive Fat Loss',
      multiplier: 10
    },
    {
      name: 'Moderate Fat Loss',
      multiplier: 12
    },
    {
      name: 'Slow Weight Loss',
      multiplier: 13
    },
    {
      name: 'Maintain',
      multiplier: 15
    },
    {
      name: 'Lean Gain',
      multiplier: 16
    },
    {
      name: 'Moderate Gain',
      multiplier: 18
    },
    {
      name: 'Aggressive Gain',
      multiplier: 20
    }
  ]

  nutritionProtocolForm = this.fb.group({
    startingWeight: [0, [Validators.required, checkIfNumber()]],
    goalWeight: [0, [Validators.required, checkIfNumber()]],
    protocolName: ['', Validators.required],
    startDate: [new NgbDate(2022,8,22), Validators.required],
    endDate: [new NgbDate(2022,8,22), Validators.required]
  })

  constructor(public accountService: AccountService, private fb: FormBuilder, private nutritionProtocolService: NutritionProtocolService, private router: Router) {
    this.nutritionProtocol = this.router.getCurrentNavigation()?.extras.state as NutritionProtocol;
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    if (this.nutritionProtocol != undefined){
      this.updateFormWithNutritionProtocolVals();
    }
  }

  updateFormWithNutritionProtocolVals(){
    this.editProtocol = true;
    this.nutritionProtocolForm.patchValue({
      startingWeight: this.nutritionProtocol?.startingWeight,
      goalWeight: this.nutritionProtocol?.goalWeight,
      protocolName: this.nutritionProtocol?.protocolName,
      startDate:  new NgbDate(Number(this.nutritionProtocol?.startDate.year), Number(this.nutritionProtocol?.startDate.month), Number(this.nutritionProtocol?.startDate.day)),
      endDate: new NgbDate(Number(this.nutritionProtocol?.endDate.year), Number(this.nutritionProtocol?.endDate.month), Number(this.nutritionProtocol?.endDate.day))
    })
    this.updateCals(Number(this.startingWeight?.value))
    this.updateProtocolCals(Number(this.startingWeight?.value), this.protocolName?.value?.toString()!)
  }

  changeStartingWeight(e: any) {
    this.startingWeight?.setValue(e.target.value, {
      onlySelf: true
    });
    let currWeight = Number(this.startingWeight?.value);
    this.updateCals(Number(currWeight));
    this.updateProtocolCals(currWeight, this.protocolName?.value!)
  }

  changeGoalWeight(e: any) {
    this.goalWeight?.setValue(e.target.value, {
      onlySelf: true
    });
  }

  updateCals(weight: number) {
    this.tdee = weight * 15;
  }

  updateProtocolCals(weight: number, protocol: string) {
    for (let p of this.protocols) {
      if (p.name.toLowerCase() === protocol.toLowerCase()) {
        let multiplier = p.multiplier;
        this.protocolCalories = weight * multiplier
        break;
      }
    }
  }

  changeProtocol(e: any) {
    console.log(e.target.value)
    this.protocolName?.setValue(e.target.value, {
      onlySelf: true,
    });
    this.updateProtocolCals(Number(this.startingWeight?.value), this.protocolName?.value!)
  }

  changeCurrentDate(e: any) {
    console.log(e.target.value)
    this.startDate?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get startingWeight() {
    return this.nutritionProtocolForm.get('startingWeight');
  }

  get goalWeight() {
    return this.nutritionProtocolForm.get('goalWeight');
  }

  get protocolName() {
    return this.nutritionProtocolForm.get('protocolName');
  }

  get startDate() {
    return this.nutritionProtocolForm.get('startDate');
  }

  get endDate() {
    return this.nutritionProtocolForm.get('endDate');
  }

  onProtocolSubmit() {
    let nutritionProtocol: NutritionProtocol = {
      email: this.accountService.user.email,
      protocolId: 0,
      startingWeight: Number(this.startingWeight?.value),
      goalWeight: Number(this.goalWeight?.value),
      protocolName: this.protocolName?.value!,
      startDate: this.startDate?.value! as unknown as Date,
      endDate: this.endDate?.value! as unknown as Date,
      protocolCalories: this.protocolCalories,
      status: 'active',
      nutritionData: {email: this.accountService.user.email, dateData: []} as NutritionData
    }
    console.log(nutritionProtocol)
    this.nutritionProtocolService.createNutritionProtocol(nutritionProtocol);
  }

  editSelectedProtocol(){
    let nutritionProtocol: NutritionProtocol = {
      email: this.accountService.user.email,
      protocolId: this.nutritionProtocol?.protocolId as number,
      startingWeight: Number(this.startingWeight?.value),
      goalWeight: Number(this.goalWeight?.value),
      protocolName: this.protocolName?.value!,
      startDate: this.startDate?.value! as unknown as Date,
      endDate: this.endDate?.value! as unknown as Date,
      protocolCalories: this.protocolCalories,
      status: 'active',
      nutritionData: this.nutritionProtocol?.nutritionData as NutritionData
    }
    console.log(this.nutritionProtocol);
    console.log(nutritionProtocol)
    this.nutritionProtocolService.updateNutritionProtocol(nutritionProtocol);
  }

  deleteSelectedProtocol(){
    console.log(this.nutritionProtocol);
    this.nutritionProtocolService.deleteNutritionProtocol(this.nutritionProtocol!);
  }
}
