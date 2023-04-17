import { logger } from '../utils/logger';
// Models
import Order from '../models/order.model';
// Types
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
        paymentMethod: 1,
        status: 1,
      }
    );
    return orders;
  }

  public async getOrder(id: string): Promise<OrderType> {
    const orders = (await Order.findById(id, {
      baker: 1,
      member: 1,
      customer: 1,
      products: 1,
      paymentMethod: 1,
      collectionTime: 1,
      status: 1,
    })) as OrderType;
    return orders;
  }

  public async getBakerOrders(id: string): Promise<OrderType[]> {
    const orders = await Order.find(
      { baker: id },
      {
        baker: 1,
        member: 1,
        customer: 1,
        products: 1,
        paymentMethod: 1,
        collectionTime: 1,
        status: 1,
      }
    );
    return orders;
  }

  public async createOrder(orderData: OrderType): Promise<OrderType> {
    let order;
    if (orderData.member) {
      order = new Order({
        status: 'On Hold',
        baker: orderData.baker,
        member: orderData.member,
        products: orderData.products,
        collectionTime: orderData.collectionTime,
        paymentMethod: orderData.paymentMethod,
      });
    } else {
      order = new Order({
        status: 'On Hold',
        baker: orderData.baker,
        customer: orderData.customer,
        products: orderData.products,
        paymentMethod: orderData.paymentMethod,
        collectionTime: orderData.collectionTime,
      });
    }
    return await order.save();
  }

  public async editOrder(
    id: string,
    orderData: OrderType
  ): Promise<OrderType | void> {
    const order = await Order.findById(id);
    if (order) {
      return order.updateOne({ $set: orderData });
    } else {
      logger.error('No Order Found');
    }
  }

  public async remove(id: string) {
    return await Order.findByIdAndRemove(id);
  }
}
