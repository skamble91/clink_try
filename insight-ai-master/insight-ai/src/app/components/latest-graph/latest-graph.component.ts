import { Component, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { GraphModel } from 'src/app/model/graphModel';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-latest-graph',
  templateUrl: './latest-graph.component.html',
  styleUrls: ['./latest-graph.component.scss'],
})
export class LatestGraphComponent {
  constructor(public graphModel: GraphModel) {}
}
