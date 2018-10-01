import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '../../../../node_modules/@angular/common/http';
import { Order } from '../interfaces/Order';
import { Observable } from '../../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(
    private http: HttpClient
  ) {}

  create(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/order', order);
  }
  fetch(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('/api/order', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }
}
