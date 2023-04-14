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
    this.router.post('/member/login', this.controller.login);
    this.router.post('/member/logout', this.controller.logout);
    this.router.put('/member/:id', this.controller.update);
    this.router.delete('/member/:id', this.controller.remove);
  }
}

export default MemberRoute;
