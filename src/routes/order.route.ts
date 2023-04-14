import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { IRoute } from '../interfaces/route.interface';

class OrderRoute implements IRoute {
  public router: Router = Router();
  public controller: OrderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/orders', this.controller.index);
  }
}

export default OrderRoute;
