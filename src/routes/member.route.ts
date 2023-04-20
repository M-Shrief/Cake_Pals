import { Router } from "express";
import { body, param } from "express-validator";
// controller
import MemberController from "../controllers/member.controller";
// middlewares
import { jwtToken, guard } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
// types
import { IRoute } from "../interfaces/route.interface";
class MemberRoute implements IRoute {
  public router: Router = Router();
  public controller: MemberController = new MemberController();

  constructor() {
    this.initializeRoutes();
  }

  private mongoIdLength = 24;
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
      [
        validate([param("id").isLength({ min: this.mongoIdLength })]),
        jwtToken(true),
        guard.check("admin"),
      ],
      this.controller.indexOne
    );

    // signup a newMember, by passing newMemberData to req.body
    // res.send(201).json({decode:name, accessToken})
    // res.cookie('accessToken') && res.header('Authorization)
    this.router.post(
      "/member/",
      validate([
        body("firstName").notEmpty().trim().escape(),
        body("lastName").notEmpty().trim().escape(),
        body("phone").isLength({ min: 12 }).trim().escape(),
        body("password").isLength({ min: 8 }).escape(),
        body("location").notEmpty().escape(),
      ]),
      this.controller.signup
    );

    // login a existingMember, by passing member's phone & password to req.body
    // res.send(200).json({decode:name, accessToken})
    // res.cookie('accessToken') && res.header('Authorization)
    this.router.post(
      "/member/login",
      validate([
        body("phone").isLength({ min: 12 }).trim().escape(),
        body("password").isLength({ min: 8 }).trim().escape(),
      ]),
      this.controller.login
    );

    // response.status(200)
    // response clearCookie('access-token'), set header('Authorization') = undefined
    this.router.post("/member/logout", this.controller.logout);

    // edit memberData by passing member_id to req.params, newMemberData to req.body
    // response.status(201).json({success, member})
    this.router.put(
      "/member/:id",
      [
        validate([param("id").isLength({ min: this.mongoIdLength })]),
        jwtToken(true),
        guard.check(["member:read", "member:write"]),
      ],
      this.controller.update
    );

    // pass member._id on req.params
    // response.status(200).json('Deleted Successfully')
    this.router.delete(
      "/member/:id",
      [
        validate([param("id").isLength({ min: this.mongoIdLength })]),
        jwtToken(true),
        guard.check([["admin"], ["member:read", "member:write"]]),
      ],
      this.controller.remove
    );
  }
}

export default MemberRoute;
