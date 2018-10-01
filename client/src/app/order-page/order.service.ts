import { Injectable } from '@angular/core';
import { Position } from '../shared/interfaces/Position';
import { OrderPosition } from '../shared/interfaces/OrderPosition';

@Injectable()
export class OrderService {
  public list: OrderPosition[] = [];
  public price: number = 0;

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })
    const candidate = this.list.find(p => p._id === position._id);
    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }
    this.computePrice();
  }

  remove(orderPosition: OrderPosition) {
    const index = this.list.findIndex(op => op._id === orderPosition._id);
    this.list.splice(index, 1);
    this.computePrice();
  }

  clear() {
    this.list = [];
    this.price = 0;
  }
  private computePrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }
}
