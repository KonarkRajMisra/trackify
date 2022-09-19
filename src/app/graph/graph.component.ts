import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'node_modules/chart.js';
import { AccountService } from '../common/services/authentication-service/account-service.service';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  graph?: Chart
  labels: Array<string> = []
  data: Array<number> = []
  navigationData: any
  WEIGHT = "weight";
  CALORIES = "calories";
  NETCALORIES = "netcalories";
  constructor(private router: Router, private accountService: AccountService) {
    this.navigationData = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser();
    this.updateNavigationData()
    Chart.register(...registerables);
    this.createGraphWithSelector(this.WEIGHT)
  }

  createGraphWithSelector(selector: string){
    this.transformDataToGraphInput(selector)
    this.createGraph(selector)
  }

  updateNavigationData(): void {
    if (this.navigationData === null || this.navigationData === undefined) {
      let navData = localStorage.getItem("graphNavigationData")
      console.log(navData)
      if (navData !== null || navData !== undefined) {
        this.navigationData = JSON.parse(navData!)
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
    console.log(this.navigationData, this.labels, this.data)
  }

  createGraph(selector: string) {
    if (this.graph !== null || this.graph !== undefined){
      this.graph?.destroy()
    }
    this.graph = new Chart("graph", {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: `${selector[0].toUpperCase()+selector.slice(1,selector.length)} Change`,
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

  updateGraph(e: any){
    this.createGraphWithSelector(e.target.value)
  }
}
