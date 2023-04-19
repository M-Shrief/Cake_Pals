import { Router } from "express";
// Controllers
import BakerController from "../controllers/baker.controller";
// middlewares
import { jwtToken, guard } from "../middlewares/auth.middleware";
// Types
import { IRoute } from "../interfaces/route.interface";

class BakerRoute implements IRoute {
  public router: Router = Router();
  public controller: BakerController = new BakerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // can pass conditional Location && Distance in request.body to get nearest bakers from x point in x distance
    // response.status(200).send(bakers)
    this.router.get("/bakers", this.controller.index);

    // response.status(200).send(baker)
    this.router.get("/baker/:id", this.controller.indexOne);

    // pass baker's details except product in request.body to signUp
    // response.status(201).json({decoded, accessToken})
    // response.cookie(access-token, token)
    // response.header(Authorization, `Bearer ${token}`)
    this.router.post("/baker", this.controller.signup);

    // pass baker's phone && password on req.body
    // response.status(200v).json({decoded, accessToken})
    // response.cookie(access-token, token)
    // response.header(Authorization, `Bearer ${token}`)    this.router.post("/baker/login", this.controller.login);
    this.router.post("/baker/login", this.controller.login);

    // response.status(200)
    // response clearCookie('access-token'), set header('Authorization') = undefined
    this.router.post("/baker/logout", this.controller.logout);

    // pass baker._id on req.params, and newBakerData on req.body
    // response.status(201).json({success, Baker})
    this.router.put(
      "/baker/:id",
      [jwtToken(), guard.check([["admin"], ["baker:read", "baker:write"]])],
      this.controller.update
    );

    // pass baker._id on req.params
    // response.status(200).json('Deleted Successfully')
    this.router.delete(
      "/baker/:id",
      [jwtToken(), guard.check(["admin"])],
      this.controller.remove
    );
    // Products
    // get bakers' products
    // can pass optional Location && Distance on request.body to get the closest ones in a distance from x location
    // response.status(200).send(products)
    this.router.get("/bakers/products", this.controller.bakersProducts);

    // get baker's products
    // response.status(200).send(products)
    this.router.get("/baker/:id/products", this.controller.bakerProducts);

    // addProduct to baker's products, by passing baker_id to req.params, product to req.body
    // response.status(201).json({Success, Baker_id, Products})
    this.router.post(
      "/baker/:id/product",
      [jwtToken(true), guard.check(["baker:read", "baker:write"])],
      this.controller.addProduct
    );

    // editProduct to baker's products, by passing baker_id to req.params, product to req.body
    // response.status(201).json({Success, Baker_id, Products})
    this.router.put(
      "/baker/:id/product/:index",
      [jwtToken(true), guard.check(["baker:read", "baker:write"])],
      this.controller.editProduct
    );

    // Delete Product from Baker's Products
    // response.status(200).send(Product_Number, state: "Deleted" )
    this.router.delete(
      "/baker/:id/product/:index",
      [jwtToken(true), guard.check([["admin"], ["baker:read", "baker:write"]])],
      this.controller.removeProduct
    );
  }
}

export default BakerRoute;
