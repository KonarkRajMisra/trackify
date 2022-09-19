import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'node_modules/chart.js';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  labels: Array<string> = []
  data: Array<number> = []
  navigationData: any
  constructor(private router: Router) {
    this.navigationData = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    this.updateNavigationData()
    Chart.register(...registerables);
    this.transformDataToGraphInput()
    this.createGraph()
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

  transformDataToGraphInput() {
    console.log(this.navigationData)
    if (this.data !== null || this.data !== undefined) {
      for (let item of this.navigationData) {
        this.labels.push(item.date)
        this.data.push(item.weight)
      }
    }
  }

  createGraph() {
    const graph = new Chart("graph", {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Weight Chage',
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
          x: {

          },
          y: {
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

}
