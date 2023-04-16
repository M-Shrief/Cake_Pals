import { Router } from 'express';
// controller
import MemberController from '../controllers/member.controller';
// middlewares
// import { authorizeJWT } from '../middlewares/auth.middleware';
// types
import { IRoute } from '../interfaces/route.interface';
import { secured, guard } from '../middlewares/auth.middleware';

class MemberRoute implements IRoute {
  public router: Router = Router();
  public controller: MemberController = new MemberController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      '/members',
      [secured(), guard.check('admin')],
      this.controller.index
    );
    this.router.get(
      '/member/:id',
      [secured(), guard.check('admin')],
      this.controller.indexOne
    );
    this.router.get(
      '/member/:id/:distance',
      [secured(), guard.check(['user', 'member:read'])],
      this.controller.getNearBakers
    );
    this.router.post('/member/', this.controller.signup);
    this.router.post('/member/login', this.controller.login);
    this.router.post('/member/logout', this.controller.logout);
    this.router.put(
      '/member/:id',
      [secured(true), guard.check(['member:write'])],
      this.controller.update
    );
    this.router.delete(
      '/member/:id',
      [secured(), guard.check('admin')],
      this.controller.remove
    );
  }
}

export default MemberRoute;
