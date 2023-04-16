import { Router } from 'express';
// Controllers
import OrderController from '../controllers/order.controller';
// middlewares
import { jwtToken, guard } from '../middlewares/auth.middleware';
// Types
import { IRoute } from '../interfaces/route.interface';

class OrderRoute implements IRoute {
  public router: Router = Router();
  public controller: OrderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/orders',
      [jwtToken(true), guard.check('admin')],
      this.controller.index
    );
    this.router.get(
      '/orders/baker/:baker',
      [jwtToken(true), guard.check([['admin'], ['baker:read', 'baker:write']])],
      this.controller.getBakerOrders
    );
    this.router.get(
      '/order/:id',
      [
        jwtToken(true),
        guard.check([
          ['admin'],
          ['member:read', 'member:write'],
          ['baker:read', 'baker:write'],
        ]),
      ],
      this.controller.indexOne
    );
    this.router.post('/order', [jwtToken()], this.controller.createOrder);
    this.router.put(
      '/order/:id',
      [
        jwtToken(true),
        guard.check([
          ['admin'],
          ['member:read', 'member:write'],
          ['baker:read', 'baker:write'],
        ]),
      ],
      this.controller.editOrder
    );
    this.router.delete(
      '/order/:id',
      [
        jwtToken(true),
        guard.check([
          ['admin'],
          ['member:read', 'member:write'],
          ['baker:read', 'baker:write'],
        ]),
      ],
      this.controller.remove
    );
  }
}

export default OrderRoute;
