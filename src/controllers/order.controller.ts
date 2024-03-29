import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
// Services
import OrderService from '../services/order.service';

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

  public BakerOrders = (req: Request, res: Response, next: NextFunction) => {
    this.orderService
      .getBakerOrders(req.params.baker)
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(err));
  };

  public MemberOrders = (req: Request, res: Response, next: NextFunction) => {
    this.orderService
      .getMemberOrders(req.params.member)
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(err));
  };

  public createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.orderService
      .createOrder(req.body)
      .then((newOrder) => {
        return res.status(201).json({
          success: true,
          Order: newOrder,
        });
      })
      .catch((err) => {
        logger.error(err);
        res.json(err);
      });
  };

  public editOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.orderService
      .editOrder(req.params.id, req.body)
      .then((updatedOrder) => {
        return res.status(201).json({
          success: true,
          Order: updatedOrder,
        });
      })
      .catch((err) => logger.error(err));
  };

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    this.orderService
      .remove(req.params.id)
      .then(() => res.send('Deleted Successfully'))
      .catch((err) => logger.error(err));
  };
}
