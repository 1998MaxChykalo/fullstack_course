import { OrderPosition } from "./OrderPosition";

export interface Order {
  _id?: string;
  date?: Date;
  order?: number;
  user?: string;
  list: OrderPosition[];
}
