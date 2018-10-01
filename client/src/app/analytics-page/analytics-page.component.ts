import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces/AnalyticsPage';
import { Subscription } from '../../../node_modules/rxjs';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  aSub: Subscription;
  average: number;
  isPending = true;

  constructor(private analyticsService: AnalyticsService) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Profit',
      color: 'rgb(255, 99, 132)'
    };
    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    };
    this.aSub = this.analyticsService.getAnalytics()
      .subscribe(
        (data: AnalyticsPage) => {
          this.average = data.average;

          gainConfig.labels = data.chart.map(item => item.label);
          gainConfig.data = data.chart.map(item => item.gain);

          // temp
          // gainConfig.labels.push('30.09.2018')
          // gainConfig.data.push(1100);
          // temp
          orderConfig.labels = data.chart.map(item => item.label);
          orderConfig.data = data.chart.map(item => item.order);

          const gainCtx = this.gainRef.nativeElement.getContext('2d');
          const orderCtx = this.orderRef.nativeElement.getContext('2d');
          gainCtx.canvas.height = '300px';
          orderCtx.canvas.height = '300px';

          new Chart(gainCtx, createChartConfig(gainConfig));
          new Chart(orderCtx, createChartConfig(orderConfig));

          this.isPending = false;
        }
      )
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true,
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
