import { logger } from '../utils/logger';
// Models
import Order from '../models/order.model';
// Types
import OrderType from '../interfaces/order.interface';
import { getDuration } from '../utils/duration';

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
        timeToBake: 1,
        overallPrice: 1,
        status: 1,
      }
    );
    return orders;
  }

  public async getOrder(id: string): Promise<OrderType> {
    const order = (await Order.findById(id, {
      baker: 1,
      member: 1,
      customer: 1,
      products: 1,
      paymentMethod: 1,
      timeToBake: 1,
      overallPrice: 1,
      collectionTime: 1,
      status: 1,
    })) as OrderType;
    return order;
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
        timeToBake: 1,
        overallPrice: 1,
        status: 1,
      }
    );
    return orders;
  }

  public async createOrder(orderData: OrderType) {
    // : Promise<OrderType>
    let order;
    const productsBakingTime = orderData.products.map(
      (product) => product.bakingTime
    );
    const bakingHours = productsBakingTime.reduce(function (acc, time): number {
      return acc + (time.hour as any);
    }, 0);
    const bakingMins = productsBakingTime.reduce(function (acc, time): number {
      return acc + (time.minutes as any);
    }, 0);
    const overallPrice = orderData.products
      .map((product) => product.price)
      .reduce(function (acc, price): number {
        return acc + (price as any);
      }, 0);
    if (orderData.member) {
      order = new Order({
        status: 'On Hold',
        baker: orderData.baker,
        member: orderData.member,
        products: orderData.products,
        collectionTime: orderData.collectionTime,
        paymentMethod: orderData.paymentMethod,
        timeToBake: { hours: bakingHours, minutes: bakingMins },
        overallPrice,
      });
    } else {
      order = new Order({
        status: 'On Hold',
        baker: orderData.baker,
        customer: orderData.customer,
        products: orderData.products,
        paymentMethod: orderData.paymentMethod,
        collectionTime: orderData.collectionTime,
        timeToBake: { hours: bakingHours, minutes: bakingMins },
        overallPrice,
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
