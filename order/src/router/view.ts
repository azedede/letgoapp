import {
  BadRequestError,
  requireAuth,
  NotAuthorizeError,
} from "@localmarket/common";
import express, { Request, Response } from "express";

import { Order } from "../model/order";

const router = express.Router();

router.get(
  "/api/order/:orderId",
  requireAuth,

  
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("product");
    if (!order) throw new BadRequestError("order not found");
    //autorization
    if (order.userId.toString() !== req.currentUser!.id.toString())
      throw new NotAuthorizeError();

    res.send(order);
  }
);

export { router as viewOrderRouter };
