import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '../../../../node_modules/@angular/router';
import { PositionsService } from '../../shared/services/positions.service';
import { Observable } from '../../../../node_modules/rxjs';
import { Position } from '../../shared/interfaces/Position';
import { switchMap, map } from '../../../../node_modules/rxjs/operators';
import { OrderService } from '../order.service';
import { MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>
  constructor(
    private route: ActivatedRoute,
    private positionsService: PositionsService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.positionsService.fetch(params['id'])
        }),
        map(
          (positions: Position[]) => {
            return positions.map(position => {
              position.quantity = 1;
              return position;
            })
          }
        )
    )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`ADDED ${position.quantity}`);
    this.orderService.add(position);
  }

}
