import { Injectable } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Injectable({
  providedIn: 'root',
})
export class GraphModel {
  chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'My-series',
        data: [],
      },
    ],
    chart: {
      height: 350,
      type: 'bar',
    },
    title: {
      text: 'Insights AI',
    },
    xaxis: {
      categories: [],
    },
  };

  // latestData: any[] = [
  //   { product_name: 'The Giver', 'sum(transaction_cost)': '1586' },
  //   { product_name: 'The Lord of the Rings', 'sum(transaction_cost)': '1537' },
  //   { product_name: 'The Metamorphosis', 'sum(transaction_cost)': '1496' },
  //   {
  //     product_name: 'The Old Man and the Sea',
  //     'sum(transaction_cost)': '1482',
  //   },
  //   { product_name: 'The Grapes of Wrath', 'sum(transaction_cost)': '1352' },
  // ];
}
