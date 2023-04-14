import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
// Services
import OrderService from '../services/order.service';
// Types
import OrderType from '../interfaces/order.interface';

export default class OrderController {
  private OrderService: OrderService = new OrderService();

  public index = (req: Request, res: Response, next: NextFunction) => {
    this.OrderService.getOrders()
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(err));
  };
}
