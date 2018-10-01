import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from '../../../node_modules/rxjs';
import { Order } from '../shared/interfaces/Order';
import { Filter } from '../shared/interfaces/Filter';

const STEP = 2;
@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  oSub: Subscription;
  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: MaterialInstance;
  isFilterVisible = false;
  orders: Order[] = [];
  filter: Filter = {};
  offset = 0;
  limit = STEP;

  isNoMoreOrders = false;
  isReloading = false;
  isLoading = false;

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.isReloading = true;
    this.fetch();
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });

    this.oSub = this.ordersService.fetch(params)
      .subscribe(
        res => {
          this.orders = this.orders.concat(res);
          this.isNoMoreOrders = res.length < STEP;
          this.isLoading = false;
          this.isReloading = false;
        }
      );
  }

  loadMore() {
    this.offset += STEP;
    this.isLoading = true;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.isReloading = true;
    this.filter = filter;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }
  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

}
