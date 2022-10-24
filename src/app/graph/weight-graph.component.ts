import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartTypeRegistry, registerables } from 'node_modules/chart.js';
import { DateData } from '../common/models/DateData';
import { NutritionSummary } from '../common/models/Summary/NutritionSummary';
import { Week } from '../common/models/Summary/Week';
import { AccountService } from '../common/services/authentication-service/account-service.service';
import { NutritionProtocolService } from '../common/services/nutrition-protocol-service/nutrition-protocol.service';
@Component({
  selector: 'app-weight-graph',
  templateUrl: './weight-graph.component.html',
  styleUrls: ['./weight-graph.component.css']
})
export class WeightGraph implements OnInit {
  dateData?: Array<DateData>
  summaryData: NutritionSummary | undefined
  graph?: Chart
  labels: Array<string> = []
  data: Array<number> = []
  dataOptions = [
    "weight",
    "averageweight",
    "calories",
    "averagenetchange"
  ]

  typeOptions = [
    "line",
    "bar"
  ]
  selectedData: string = this.dataOptions[0]
  selectedType: string = this.typeOptions[0]
  constructor(private router: Router, private accountService: AccountService, private nutritionProtocolService: NutritionProtocolService) {}

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    this.nutritionProtocolService.getAllNutritionProtocols(this.accountService.user.email, this.accountService.user.authToken).subscribe((res) => {
      this.dateData = res[0].nutritionData?.dateData
      if (res[0].nutritionData?.summaryData !== undefined){
        this.summaryData = res[0].nutritionData?.summaryData!
      }
      Chart.register(...registerables);
      this.createGraphWithSelector(this.selectedData);
    })
  }

  ngOnDestroy() {
    if (this.graph !== null || this.graph !== undefined) {
      this.graph?.destroy()
    }
  }

  createGraphWithSelector(selector: string) {
    this.transformDataToGraphInput(selector)
    this.createGraph(selector, this.selectedType as keyof ChartTypeRegistry)
  }

  transformDataToGraphInput(selector: string) {
    if (selector === "calories" || selector === "weight"){
      if (this.dateData !== null && this.dateData !== undefined) {
        this.labels = []
        this.data = []
        for (let dateObj of this.dateData!) {
          this.labels.push(dateObj.date)
          this.data.push(Number(dateObj[selector.toLocaleLowerCase() as keyof DateData]))
        }
      }
    }
    else if (selector === "averageweight" || selector === 'averagenetchange'){
      switch (selector){
        case "averageweight": {
          selector = 'averageWeight';
          break;
        }
        case "averagenetchange": {
          selector = 'netChange';
          break;
        }
      }
      if (this.summaryData !== null && this.summaryData !== undefined) {
        this.labels = []
        this.data = []
        for (let summaryObj of this.summaryData.summary){
          this.labels.push(summaryObj.endDate)
          this.data.push(Number(summaryObj[selector as keyof Week]))
        }
      }
    }
    console.log("LABELS", this.labels)
    console.log("DATA", this.data)
  }

  createGraph(selector: string, type: keyof ChartTypeRegistry) {
    if (this.graph !== null || this.graph !== undefined) {
      this.graph?.destroy()
    }
    this.graph = new Chart("graph", {
      type: type,
      data: {
        labels: this.labels,
        datasets: [{
          label: `${selector[0].toUpperCase() + selector.slice(1, selector.length)} Change`,
          data: this.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {},
          y: {
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  updateGraphData(e: any) {
    this.createGraphWithSelector(e.target.value.replace(/\s/g, "").toLowerCase())
    this.selectedData = e.target.value.replace(/\s/g, "").toLowerCase()
    console.log(this.selectedData)
  }

  updateGraphType(e: any) {
    this.createGraph(this.selectedData, e.target.value.replace(/\s/g, "").toLowerCase())
    this.selectedType = e.target.value.replace(/\s/g, "").toLowerCase()
    console.log(this.selectedType)
  }
}
