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
    this.router.get('/orders/baker/:baker', this.controller.getBakerOrders);
    this.router.get('/order/:id', this.controller.indexOne);
    this.router.post('/order', this.controller.createOrder);
    this.router.put('/order/:id', this.controller.editOrder);
    this.router.delete('/order/:id', this.controller.remove);
  }
}

export default OrderRoute;
