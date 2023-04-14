import { Router } from 'express';
import MemberController from '../controllers/member.controller';
import { IRoute } from '../interfaces/route.interface';

class MemberRoute implements IRoute {
  public router: Router = Router();
  public controller: MemberController = new MemberController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get('/members', this.controller.index);
    this.router.get('/member/:id', this.controller.indexOne);
    this.router.get('/member/:id/:distance', this.controller.getNearBakers);
    this.router.post('/member/', this.controller.signup);
  }
}

export default MemberRoute;
