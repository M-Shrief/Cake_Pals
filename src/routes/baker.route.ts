import { Router } from "express";
import { body, param } from "express-validator";
// Controllers
import BakerController from "../controllers/baker.controller";
// middlewares
import { jwtToken, guard } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
// Types
import { IRoute } from "../interfaces/route.interface";

class BakerRoute implements IRoute {
  public router: Router = Router();
  public controller: BakerController = new BakerController();

  constructor() {
    this.initializeRoutes();
  }

  private mongoIdLength = 24;

  private initializeRoutes() {
    // can pass conditional Location && Distance in request.body to get nearest bakers from x point in x distance
    // response.status(200).send(bakers)
    this.router.get(
      "/bakers",
      validate([
        body("location.type").optional().notEmpty().equals("Point"),
        body("location.coordinates").optional().notEmpty().isArray(),
        body("distance").optional().isInt(),
      ]),
      this.controller.index
    );

    // response.status(200).send(baker)
    this.router.get(
      "/baker/:id",
      [validate([param("id").isLength({ min: this.mongoIdLength })])],
      this.controller.indexOne
    );

    // pass baker's details except product in request.body to signUp
    // response.status(201).json({decoded, accessToken})
    // response.cookie(access-token, token)
    // response.header(Authorization, `Bearer ${token}`)
    this.router.post(
      "/baker",
      validate([
        body("firstName").notEmpty(),
        body("lastName").notEmpty(),
        body("phone").isLength({ min: 12 }),
        body("password").isLength({ min: 8 }),
        body("location").notEmpty(),
        body("rating").isInt(),
        body("collectionTime.*.*").isInt(),
      ]),
      this.controller.signup
    );

    // pass baker's phone && password on req.body
    // response.status(200v).json({decoded, accessToken})
    // response.cookie(access-token, token)
    // response.header(Authorization, `Bearer ${token}`)    this.router.post("/baker/login", this.controller.login);
    this.router.post(
      "/baker/login",
      validate([
        body("phone").isLength({ min: 12 }),
        body("password").isLength({ min: 8 }),
      ]),
      this.controller.login
    );

    // response.status(200)
    // response clearCookie('access-token'), set header('Authorization') = undefined
    this.router.post("/baker/logout", this.controller.logout);

    // pass baker._id on req.params, and newBakerData on req.body
    // response.status(201).json({success, Baker})
    this.router.put(
      "/baker/:id",
      [
        validate([
          param("id").isLength({ min: this.mongoIdLength }),
          body("firstName").optional().notEmpty(),
          body("lastName").optional().notEmpty(),
          body("phone").optional().isLength({ min: 12 }),
          body("location").optional().notEmpty(),
          body("collectionTime.*.*").optional().isInt(),
        ]),
        jwtToken(),
        guard.check([["admin"], ["baker:read", "baker:write"]]),
      ],
      this.controller.update
    );

    // pass baker._id on req.params
    // response.status(200).json('Deleted Successfully')
    this.router.delete(
      "/baker/:id",
      [
        validate([param("id").isLength({ min: this.mongoIdLength })]),
        jwtToken(),
        guard.check([["admin"], ["baker:read", "baker:write"]]),
      ],
      this.controller.remove
    );
    // Products
    // get bakers' products
    // can pass optional Location && Distance on request.body to get the closest ones in a distance from x location
    // response.status(200).send(products)
    this.router.get(
      "/bakers/products",
      validate([
        body("location.type").optional().notEmpty().equals("Point"),
        body("location.coordinates").optional().notEmpty().isArray(),
        body("distance").optional().isInt(),
      ]),
      this.controller.bakersProducts
    );

    // get baker's products
    // response.status(200).send(products)
    this.router.get(
      "/baker/:id/products",
      validate([param("id").isLength({ min: this.mongoIdLength })]),
      this.controller.bakerProducts
    );

    // addProduct to baker's products, by passing baker_id to req.params, product to req.body
    // response.status(201).json({Success, Baker_id, Products})
    this.router.post(
      "/baker/:id/product",
      [
        validate([param("id").isLength({ min: this.mongoIdLength })]),
        jwtToken(true),
        guard.check(["baker:read", "baker:write"]),
      ],
      this.controller.addProduct
    );

    // editProduct to baker's products, by passing baker_id to req.params, product to req.body
    // response.status(201).json({Success, Baker_id, Products})
    this.router.put(
      "/baker/:id/product/:index",
      [
        validate([param("id").isLength({ min: this.mongoIdLength })]),
        jwtToken(true),
        guard.check(["baker:read", "baker:write"]),
      ],
      this.controller.editProduct
    );

    // Delete Product from Baker's Products
    // response.status(200).send(Product_Number, state: "Deleted" )
    this.router.delete(
      "/baker/:id/product/:index",
      [
        validate([param("id").isLength({ min: this.mongoIdLength })]),
        jwtToken(true),
        guard.check([["admin"], ["baker:read", "baker:write"]]),
      ],
      this.controller.removeProduct
    );
  }
}

export default BakerRoute;
