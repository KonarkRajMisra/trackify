import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartTypeRegistry, registerables } from 'node_modules/chart.js';
import { DateData } from '../common/models/DateData';
import { AccountService } from '../common/services/authentication-service/account-service.service';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Input() dateData?: any
  graph?: Chart
  labels: Array<string> = []
  data: Array<number> = []
  navigationData: any
  selectedData: string = "weight"
  selectedType: keyof ChartTypeRegistry = "line"

  dataOptions = [
    "Weight",
    "Calories",
    "Net Calories"
  ]

  typeOptions = [
    "Line",
    "Bar"
  ]
  constructor(private router: Router, private accountService: AccountService) {
    // If graph data is coming from navigation
    if (this.router.getCurrentNavigation()?.extras.state !== undefined) {
      this.navigationData = this.router.getCurrentNavigation()?.extras.state;
    }
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    this.updateNavigationData();
    Chart.register(...registerables);
    this.createGraphWithSelector(this.selectedData);
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

  updateNavigationData(): void {
    if (this.navigationData === null || this.navigationData === undefined) {
      let navData = localStorage.getItem("graphNavigationData")
      if (navData !== null && navData !== undefined) {
        this.navigationData = JSON.parse(navData!)
      } else {
        this.navigationData = this.dateData
        localStorage.setItem("graphNavigationData", JSON.stringify(this.navigationData))
      }
    }
    else {
      localStorage.setItem("graphNavigationData", JSON.stringify(this.navigationData))
    }
  }

  transformDataToGraphInput(selector: string) {
    if (this.data !== null || this.data !== undefined) {
      this.labels = []
      this.data = []
      for (let item of this.navigationData) {
        this.labels.push(item.date)
        this.data.push(item[selector])
      }
      console.log("LABELS", this.labels)
      console.log("DATA", this.data)
    }
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
