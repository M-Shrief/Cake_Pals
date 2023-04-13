import { Router } from 'express';
import BakerController from '../controllers/baker.controller';
import { IRoute } from '../interfaces/route.interface';

class BakerRoute implements IRoute {
  // public path: string = ;
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
    this.router.delete('/baker/:id', this.controller.remove);
    // Products
    // TODO: Caching Middleware
    this.router.get('/bakers/products', this.controller.bakersProducts);
    this.router.get('/baker/:id/products', this.controller.bakerProducts);
  }
}

export default BakerRoute;