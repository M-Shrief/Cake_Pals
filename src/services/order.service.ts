// Models
import Order from "../models/order.model";
// Types
import OrderType from "../interfaces/order.interface";
import { Time } from "../interfaces/__types__";
import { Logger } from "winston";
// Utils
import { now, subtract, difference, addDuration } from "../utils/duration";
import { logger } from "../utils/logger";
export default class OrderService {
  public async getOrders(): Promise<OrderType[]> {
    const orders = await Order.find(
      {
        // get Today's Orders only
        createdAt: { $gt: subtract(now, 1, "d") },
      },
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
      createdAt: 1,
    })) as OrderType;
    return order;
  }

  public async getBakerOrders(id: string): Promise<OrderType[]> {
    const orders = await Order.find(
      { baker: id, createdAt: { $gt: subtract(now, 1, "d") } },
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

  public async getMemberOrders(id: string): Promise<OrderType[]> {
    const orders = await Order.find(
      { member: id, createdAt: { $gt: subtract(now, 1, "d") } },
      {
        baker: 1,
        member: 1,
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

  private async bakerIsBooked(
    id: string,
    timeToBake: Time,
    collectionTime: Time
  ) {
    // getting total bakingTime for bakerOrders(on hold/progress)
    const todayOrders = await Order.find(
      {
        baker: id,
        createdAt: { $gt: subtract(now, 1, "d") },
        status: "On Hold" || "On Progress",
        collectionTime: { $lt: collectionTime },
      },
      { timeToBake: 1 }
    );
    const todayBakingTime = todayOrders
      .map((todayOrder) => todayOrder.timeToBake)
      .reduce(
        (acc, bakingTime) => {
          return (acc = addDuration(acc, bakingTime));
        },
        { hours: 0, minutes: 0 }
      );

    // Bakers can have intersected collectionTime. So we'll only checl if he has available time to bake them
    // Assuming the average baker to work <= 12 hours
    // we will see if his alreadyBook + newOrderBakingTime >= 12
    // if yes then he is booked, and return a boolean value
    const bookedHours = difference(
      collectionTime,
      addDuration(todayBakingTime, timeToBake),
      "hours"
    );
    const isBooked = bookedHours >= 12;
    return isBooked;
  }

  public async createOrder(orderData: OrderType): Promise<OrderType | Logger> {
    let order;

    // Calculating products' bakingTime, and calculate timeToBake
    const timeToBake = orderData.products
      .map((product) => product.bakingTime)
      .reduce(
        (acc, bakingTime) => {
          return (acc = addDuration(acc, bakingTime));
        },
        { hours: 0, minutes: 0 }
      );

    if (
      await this.bakerIsBooked(
        orderData.baker,
        timeToBake,
        orderData.collectionTime
      )
    ) {
      return logger.error("Already Booked");
    }
    const overallPrice = orderData.products
      .map((product) => product.price)
      .reduce(function (acc, price): number {
        return acc + price;
      }, 0);
    if (orderData.member) {
      order = new Order({
        status: "On Hold",
        baker: orderData.baker,
        member: orderData.member,
        products: orderData.products,
        collectionTime: orderData.collectionTime,
        paymentMethod: orderData.paymentMethod,
        timeToBake,
        overallPrice,
      });
    } else {
      order = new Order({
        status: "On Hold",
        baker: orderData.baker,
        customer: orderData.customer,
        products: orderData.products,
        paymentMethod: orderData.paymentMethod,
        collectionTime: orderData.collectionTime,
        timeToBake,
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
      logger.error("No Order Found");
    }
  }

  public async remove(id: string) {
    return await Order.findByIdAndRemove(id);
  }
}
