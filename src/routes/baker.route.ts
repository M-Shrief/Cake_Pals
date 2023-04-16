import { Router } from 'express';
// Controllers
import BakerController from '../controllers/baker.controller';
// middlewares
import { jwtToken, guard } from '../middlewares/auth.middleware';
// Types
import { IRoute } from '../interfaces/route.interface';

class BakerRoute implements IRoute {
  public router: Router = Router();
  public controller: BakerController = new BakerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/bakers', this.controller.index);
    this.router.get('/baker/:id', this.controller.indexOne);
    this.router.post('/baker', this.controller.signup);
    this.router.post('/baker/login', this.controller.login);
    this.router.post('/baker/logout', this.controller.logout);
    this.router.put(
      '/baker/:id',
      // admin or baker:read/write
      [jwtToken(), guard.check([['admin'], ['baker:read', 'baker:write']])],
      this.controller.update
    );
    this.router.delete(
      '/baker/:id',
      [jwtToken(), guard.check(['admin'])],
      this.controller.remove
    );
    // Products
    // TODO: Caching Middleware
    this.router.get('/bakers/products', this.controller.bakersProducts);
    this.router.get('/baker/:id/products', this.controller.bakerProducts);
    this.router.post(
      '/baker/:id/product',
      [jwtToken(true), guard.check(['baker:read', 'baker:write'])],
      this.controller.addProduct
    );
    this.router.put(
      '/baker/:id/product/:index',
      [jwtToken(true), guard.check(['baker:read', 'baker:write'])],
      this.controller.editProduct
    );
    this.router.delete(
      '/baker/:id/product/:index',
      [jwtToken(true), guard.check([['admin'], ['baker:read', 'baker:write']])],
      this.controller.removeProduct
    );
  }
}

export default BakerRoute;
