import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-merchant-dashboard',
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.css']
})
export class MerchantDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // const ctx = document.getElementById('myChart');
    // if (ctx instanceof HTMLCanvasElement) {
    //   const myChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: this.data,
    //     options: {
    //       scales: {
    //         yAxes: [{
    //           ticks: {
    //             beginAtZero: true
    //           }
    //         }]
    //       }
    //     }
    //   });
    // }
  }

  data: any = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Visitors',
        data: [100, 50, 0, 30, 60, 70, 80],
        backgroundColor: ['#2980b9', '#f39c12', '#9b59b6', '#2ecc71', '#e74c3c', '#3498db', '#95a5a6'],
        borderColor: ['#2980b9', '#f39c12', '#9b59b6', '#2ecc71', '#e74c3c', '#3498db', '#95a5a6'],
        borderWidth: 1
      }
    ]
  };

}
