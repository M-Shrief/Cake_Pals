import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
// Services
import OrderService from '../services/order.service';
// Types
import OrderType from '../interfaces/order.interface';

export default class OrderController {
  private orderService: OrderService = new OrderService();

  public index = (req: Request, res: Response, next: NextFunction) => {
    this.orderService
      .getOrders()
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(err));
  };

  public indexOne = (req: Request, res: Response, next: NextFunction) => {
    this.orderService
      .getOrder(req.params.id)
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(err));
  };

  public getBakerOrders = (req: Request, res: Response, next: NextFunction) => {
    this.orderService
      .getBakerOrders(req.params.baker)
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(err));
  };

  public createOrder = (req: Request, res: Response, next: NextFunction) => {
    this.orderService
      .createOrder(req.body)
      .then((newOrder) => {
        return res.status(201).json({
          success: true,
          Order: newOrder,
        });
      })
      .catch((err) => logger.error(err));
  };
}
