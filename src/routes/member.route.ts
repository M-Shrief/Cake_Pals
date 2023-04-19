import { Router } from "express";
// controller
import MemberController from "../controllers/member.controller";
// middlewares
import { jwtToken, guard } from "../middlewares/auth.middleware";
// types
import { IRoute } from "../interfaces/route.interface";

class MemberRoute implements IRoute {
  public router: Router = Router();
  public controller: MemberController = new MemberController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    // res.status(200).sned(members)
    this.router.get(
      "/members",
      [jwtToken(true), guard.check("admin")],
      this.controller.index
    );

    // res.status(200).send(member)
    this.router.get(
      "/member/:id",
      [jwtToken(true), guard.check("admin")],
      this.controller.indexOne
    );

    // signup a newMember, by passing newMemberData to req.body
    // res.send(201).json({decode:name, accessToken})
    // res.cookie('accessToken') && res.header('Authorization)
    this.router.post("/member/", this.controller.signup);

    // login a existingMember, by passing member's phone & password to req.body
    // res.send(200).json({decode:name, accessToken})
    // res.cookie('accessToken') && res.header('Authorization)
    this.router.post("/member/login", this.controller.login);

    // response.status(200)
    // response clearCookie('access-token'), set header('Authorization') = undefined
    this.router.post("/member/logout", this.controller.logout);

    // edit memberData by passing member_id to req.params, newMemberData to req.body
    // response.status(201).json({success, member})
    this.router.put(
      "/member/:id",
      [jwtToken(true), guard.check(["member:read", "member:write"])],
      this.controller.update
    );

    // pass member._id on req.params
    // response.status(200).json('Deleted Successfully')
    this.router.delete(
      "/member/:id",
      [jwtToken(true), guard.check("admin")],
      this.controller.remove
    );
  }
}

export default MemberRoute;
