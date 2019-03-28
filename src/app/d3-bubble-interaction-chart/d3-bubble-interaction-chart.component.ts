import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-bubble-interaction-chart',
  templateUrl: './d3-bubble-interaction-chart.component.html',
  styleUrls: ['./d3-bubble-interaction-chart.component.scss']
})
export class D3BubbleInteractionChartComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    this.createBubbleChart();
  }

  createBubbleChart() {
    let width = 900;
    let height = 600;

    let svg = d3.select('#chart')
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('transform', 'translate(0,0)')

    let radiusScale = d3.scaleSqrt().domain([20000, 1284332]).range([7, 32]);

    let forceXSplit = d3.forceX((d) => {
      if (d['Group'] == 1) {
        return 150;
      } else {
        return 750;
      }
    }).strength(0.05);

    let forceXCombine = d3.forceX(width / 2).strength(0.05);

    let forceCollide = d3.forceCollide((d) => radiusScale(+d['Customers']) + 1);

    // forceSimulation will apply force to the circles to move them to a certain place
    // and how we want put circles to interact
    // STEP1 - get the circles to the middle
    // STEP2 - do not let them collide
    var simulation = d3.forceSimulation()
      .force('x', forceXCombine)
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('collide', forceCollide)

    d3.csv("../assets/CRSPartners.csv")
      .then(function (data) {
        console.log(data);
        ready(data);
      })
      .catch((err) => console.log(err));

    function ready(datapoints) {
      // make circles for every datapoint
      let circles = svg.selectAll('g')
        .data(datapoints)
        .enter()
        .append('g')

      circles.append('circle')
        .attr('class', 'node')
        .attr('r', (d) => radiusScale(+d['Customers']))
        .attr('fill', (d) => {
          if(d['Group'] == 1){
            return 'rgb(131, 216, 158)';
          }else{
            return 'lightgrey';
          }
        })
        .attr('stroke', '#565352')
        .attr('stroke-width', '0.5');

      // text on the circles
      // circles.append('text')
      //   .text(function (d) {
      //     return d['Name'].substring(0, radiusScale(+d['Customers']) / 5);
      //   })
      //   .attr('font', '3px sans-serif')
      //   .style("text-anchor", "middle")

      circles.on('click', (d) => console.log(d));

      d3.select("#split").on('click', function () {
        console.log('split the bubbles');
        simulation
          .force("x", forceXSplit)
          .alphaTarget(0.6)
          .restart()
      });

      d3.select("#combine").on('click', function () {
        console.log('combine the bubbles');
        simulation
          .force("x", forceXCombine)
          .alphaTarget(0.3)
          .restart()
      });

      // pass the datapoints as nodes
      // on every single tick, the modes will be acted by the forces
      simulation.nodes(datapoints)
        .on('tick', ticked)

      // on every tick reposition the circles
      function ticked() {
        svg.selectAll('circle')
          .attr('cx', (d) => d['x'])
          .attr('cy', (d) => d['y'])

        svg.selectAll('text')
          .attr('x', (d) => d['x'])
          .attr('y', (d) => d['y'])
      }
    }
  }

}
