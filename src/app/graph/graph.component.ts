import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartTypeRegistry, registerables } from 'node_modules/chart.js';
import { PlanDateData } from '../common/models/PlanDateData';
import { AccountService } from '../common/services/authentication-service/account-service.service';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Input() planDatesData?: any
  graph?: Chart
  labels: Array<string> = []
  data: Array<number> = []
  navigationData: any
  selectedData: string = "weight"
  selectedType: keyof ChartTypeRegistry = "line"
  WEIGHT = "weight";
  CALORIES = "calories";
  NETCALORIES = "netcalories";
  LINE = "line"
  BAR = "bar"



  constructor(private router: Router, private accountService: AccountService) {
    // If graph data is coming from navigation
    if (this.router.getCurrentNavigation()?.extras.state !== undefined) {
      this.navigationData = this.router.getCurrentNavigation()?.extras.state;
    }
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    this.updateNavigationData()
    Chart.register(...registerables);
    this.createGraphWithSelector(this.WEIGHT)
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
        this.navigationData = this.planDatesData
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
    if (e.target.value !== "Change Graph Data") {
      this.createGraphWithSelector(e.target.value)
      this.selectedData = e.target.value
    }
  }

  updateGraphType(e: any) {
    if (e.target.value !== "Change Graph Type") {
      this.createGraph(this.selectedData, e.target.value)
      this.selectedType = e.target.value
    }

  }
}
