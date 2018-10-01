import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Observable } from '../../../node_modules/rxjs';
import { OverviewPage } from '../shared/interfaces/OverviewPage';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef: ElementRef;
  tapTarget: MaterialInstance;
  data$: Observable<OverviewPage>;

  yesterday = new Date();
  constructor(
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.data$ = this.analyticsService.getOverview();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }
  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }
  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }

  openInfo() {
    this.tapTarget.open();
  }

  closeInfo() {
    this.tapTarget.close();
  }

}
