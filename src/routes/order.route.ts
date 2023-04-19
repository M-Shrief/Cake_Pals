import { Router } from "express";
// Controllers
import OrderController from "../controllers/order.controller";
// middlewares
import { jwtToken, guard } from "../middlewares/auth.middleware";
// Types
import { IRoute } from "../interfaces/route.interface";

class OrderRoute implements IRoute {
  public router: Router = Router();
  public controller: OrderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get Today's Orders, res.status(200).send(orders)
    this.router.get(
      "/orders",
      [jwtToken(true), guard.check("admin")],
      this.controller.index
    );

    // Get Today's Baker's Orders, res.status(200).send(orders)
    this.router.get(
      "/orders/baker/:baker",
      [jwtToken(true), guard.check([["admin"], ["baker:read", "baker:write"]])],
      this.controller.BakerOrders
    );

    // Get Today's Member's Orders, res.status(200).send(orders)
    this.router.get(
      "/orders/member/:member",
      [
        jwtToken(true),
        guard.check([["admin"], ["member:read", "member:write"]]),
      ],
      this.controller.MemberOrders
    );

    // Get specific Order, res.status(200).send(order)
    this.router.get(
      "/order/:id",
      [
        jwtToken(true),
        guard.check([
          ["admin"],
          ["member:read", "member:write"],
          ["baker:read", "baker:write"],
        ]),
      ],
      this.controller.indexOne
    );

    // Create new Order by passing OrderData to req.body
    // res.status(201).json({success, newOrder})
    this.router.post("/order", [jwtToken()], this.controller.createOrder);

    // Edit Order by passing Order.id to req.params, OrderData to req.body
    // res.status(201).json({success, newOrder})
    this.router.put(
      "/order/:id",
      [
        jwtToken(true),
        guard.check([
          ["admin"],
          ["member:read", "member:write"],
          ["baker:read", "baker:write"],
        ]),
      ],
      this.controller.editOrder
    );

    // pass Order._id on req.params
    // response.status(200).json('Deleted Successfully')
    this.router.delete(
      "/order/:id",
      [
        jwtToken(true),
        guard.check([
          ["admin"],
          ["member:read", "member:write"],
          ["baker:read", "baker:write"],
        ]),
      ],
      this.controller.remove
    );
  }
}

export default OrderRoute;
