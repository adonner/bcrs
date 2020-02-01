/*
============================================
; Title: purchases-chart.component
; Author: Troy Martin
; Date: 01/22/2020
; Modified By: Troy Martin
; Description: Purchases Chart
;===========================================
*/
// import angular and our custom components
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './purchases-graph.component.html',
  styleUrls: ['./purchases-graph.component.css']
})
export class PurchasesGraphComponent implements OnInit {
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api/invoices`;

  // the type of the chart
  selectedChart = 'bar';

  // chart data
  data: any;

  // default options
  options = { responsive: true };

  // pie chart options
  pieChartOptions = { responsive: true };

  // bar chart options
  barChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        min: 0,
        step: 1,
        display: true,
        ticks: {
          beginAtZero: true,
          min: 0,
          stepSize: 1,
        }
      }]
    }
  };

  // colors for the pie chart
  pieChartColorOptions = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4dff88',
    '#d279d2',
    '#ff794d',
    '#d2a679',
    '#4dffff'
  ];

  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(private http: HttpClient) { }

  /*
  ; Params: none
  ; Response: none
  ; Description: Initialize the component
  */
  ngOnInit() {
    this.getData();
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: gets the data for the chart and formats for the selected chart type
  */
  getData() {
    this.http.get(`${this.apiBaseUrl}/purchases-graph`)
      .pipe(map((res) => {
        if (res && Array.isArray(res)) {
          const labels = [];
          const data = [];
          // convert to the chart format
          res.forEach((x) => {
            labels.push(x._id.service);
            data.push(x.quantity);
          });

          if (this.selectedChart === 'bar') {
            this.options = this.barChartOptions;
            return {
              labels,
              datasets: [
                {
                  label: 'Services Purchased',
                  backgroundColor: '#d95000',
                  borderColor: '#e5671e',
                  data
                }
              ]
            };
          } else {
            this.options = this.pieChartOptions;

            // set a color for each data point
            const backgroundColor = [];
            data.forEach((x, index) => {
              backgroundColor.push(this.pieChartColorOptions[index]);
            });

            return {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor
                }
              ]
            };
          }


        }
      }, (err) => {
        console.log('purchases-graph.component/getData', err);
      })).subscribe((results) => {
        // set the data set
        this.data = results;
      });
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Change the type of chart displayed
  */
  onChartChange(chart: string) {
    console.log('purchases-graph.component/onChartChange', chart);
    this.selectedChart = chart;
    this.getData();
  }

}
