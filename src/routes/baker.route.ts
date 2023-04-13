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
  }
}

export default BakerRoute;
