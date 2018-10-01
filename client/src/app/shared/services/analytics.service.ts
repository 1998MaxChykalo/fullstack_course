import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Observable } from '../../../../node_modules/rxjs';
import { OverviewPage } from '../interfaces/OverviewPage';
import { AnalyticsPage } from '../interfaces/AnalyticsPage';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getOverview(): Observable<OverviewPage> {
    return this.http.get<OverviewPage>('/api/analytics/overview');
  }
  getAnalytics(): Observable<AnalyticsPage> {
    return this.http.get<AnalyticsPage>('/api/analytics/analytics');
  }
}
