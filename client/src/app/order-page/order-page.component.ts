import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '../../../node_modules/@angular/router';
import { MaterialService, MaterialInstance } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { OrderPosition } from '../shared/interfaces/OrderPosition';
import { OrdersService } from '../shared/services/orders.service';
import { Order } from '../shared/interfaces/Order';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [ OrderService ]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  isRoot: boolean;
  isPending = false;
  private oSub: Subscription;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd)
          this.isRoot = this.router.url === '/order';
      })
  }
  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    this.modal.close();
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  removePosition(orderPosition: OrderPosition) {
    this.orderService.remove(orderPosition)
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.isPending = true;
    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id;
        return item;
      })
    };
    this.oSub = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`ORDER №${newOrder.order} WAS_ADDED`);
        this.orderService.clear();
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close();
        this.isPending = false;
      }
    );
  }
}
