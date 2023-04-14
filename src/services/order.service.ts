import { logger } from '../utils/logger';
// Models
import Order from '../models/order.model';
// Types
import {} from '../interfaces/__types__';
import OrderType from '../interfaces/order.interface';

export default class OrderService {
  public async getOrders(): Promise<OrderType[]> {
    const orders = await Order.find(
      {},
      {
        baker: 1,
        member: 1,
        customer: 1,
        products: 1,
        collectionTime: 1,
        status: 1,
      }
    );
    return orders;
  }
}
