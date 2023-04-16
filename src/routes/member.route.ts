import { Router } from 'express';
// controller
import MemberController from '../controllers/member.controller';
// middlewares
import { jwtToken, guard } from '../middlewares/auth.middleware';
// types
import { IRoute } from '../interfaces/route.interface';

class MemberRoute implements IRoute {
  public router: Router = Router();
  public controller: MemberController = new MemberController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      '/members',
      [jwtToken(true), guard.check('admin')],
      this.controller.index
    );
    this.router.get(
      '/member/:id',
      [jwtToken(true), guard.check('admin')],
      this.controller.indexOne
    );
    this.router.get(
      '/member/:id/:distance',
      [jwtToken(true), guard.check(['member:read'])],
      this.controller.getNearBakers
    );
    this.router.post('/member/', this.controller.signup);
    this.router.post('/member/login', this.controller.login);
    this.router.post('/member/logout', this.controller.logout);
    this.router.put(
      '/member/:id',
      [jwtToken(true), guard.check(['member:write'])],
      this.controller.update
    );
    this.router.delete(
      '/member/:id',
      [jwtToken(true), guard.check('admin')],
      this.controller.remove
    );
  }
}

export default MemberRoute;
