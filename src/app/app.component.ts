import {Component, OnInit} from '@angular/core';
import {WeatherService} from './weather.service';
import {Chart} from 'chart.js';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {IndiaGdpService} from "./india-gdp.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  linechart = []; // this will hold the chart info
  piechart = [];
  barchart = [];
  d3BarChartData = <any>[];

  // dashboard
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(({matches}) => {
      if (matches) {
        return [
          {title: 'd3 bubble chart', cols: 2, rows: 1},
          {title: 'd3 bar chart', cols: 2, rows: 1},
          {title: 'pie chart', cols: 2, rows: 1},
          {title: 'bar chart', cols: 2, rows: 1},
          {title: 'line chart', cols: 2, rows: 1}
        ];
      }

      return [
        {title: 'd3 bubble chart', cols: 2, rows: 2},
        {title: 'd3 bar chart', cols: 1, rows: 1},
        {title: 'pie chart', cols: 1, rows: 1},
        {title: 'bar chart', cols: 1, rows: 1},
        {title: 'line chart', cols: 1, rows: 1}
      ];
    })
  );

  constructor(private _weather: WeatherService,
              private breakpointObserver: BreakpointObserver,
              private _indGDP: IndiaGdpService) {
  }

  ngOnInit() {

    // give everything a chance to get loaded before starting the animation to reduce choppiness
    setTimeout(() => {
      this.generateData();

      // change the data periodically
      //setInterval(() => this.generateData(), 3000);
    }, 1000);

    setTimeout(() => {
      this.pieChart();
    }, 1000);

    this._indGDP.getIndGDP()
      .subscribe((res) => {
        this.barChart(res);
      });

    this._weather.dailyForecast()
      .subscribe((res) => {
        //enable CORS in browser to access data
        this.lineChart(res);
      });
  }

  generateData() {
    this.d3BarChartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.d3BarChartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }

  barChart(res) {
    let GDP = res.map(res => res.Value);
    let dates = res.map(res => res.DateTime);
    let reportDates = [];
    dates.forEach((res) => {
      let jsdate = new Date(res);
      reportDates.push(jsdate.getFullYear())
    });
    this.barchart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: reportDates,
        datasets: [{
          data: GDP,
          backgroundColor: [
            'rgba(255, 99, 132, 0.75)',
            'rgba(54, 162, 235, 0.75)',
            'rgba(255, 206, 86, 0.75)',
            'lightblue',
            'lightgreen',
            'rgba(255, 159, 64, 0.75)',
            'rgba(157, 195, 86, 0.75)',
            'rgba(132, 110, 223, 0.75)',
            'rgba(188, 143, 89, 0.6)',
            'rgba(89, 189, 122, 0.75)'
          ],
        }]
      },
      options : {
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            categoryPercentage: 0.88, // control the spacing between bars
            barPercentage: 1.0
          }],
          yAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        layout: {
          padding: {
            left: 60,
            right: 60,
            top: 10,
            bottom: 20
          }
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Bar chart - ChartJs'
        }
      }
    })
  }

  pieChart() {
    this.piechart = new Chart('pieChart', {
      type: 'pie',
      data: {
        datasets: [{
          data: [28, 41, 16, 32, 8],
          backgroundColor: ['#ff6384', '#ffce56', '#36a2eb', 'violet', 'lightgreen']
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
          'Red',
          'Yellow',
          'Blue'
        ]
      },
      options: {
        title: {
          display: true,
          text: 'pie chart - ChartJs'
        }
      }
    });
  }

  lineChart(res) {
    let temp_max = res['list'].map(res => res.main.temp_max);
    let temp_min = res['list'].map(res => res.main.temp_min);
    let alldates = res['list'].map(res => res.dt);
    let weatherDates = [];
    alldates.forEach((res) => {
      let jsdate = new Date(res * 1000)
      weatherDates.push(jsdate.toLocaleTimeString('en', {year: 'numeric', month: 'short', day: 'numeric'}))
    });
    this.linechart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: weatherDates,
        datasets: [
          {
            data: temp_max,
            borderColor: "#3cba9f",
            fill: false
          },
          {
            data: temp_min,
            borderColor: "#ffcc00",
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}
