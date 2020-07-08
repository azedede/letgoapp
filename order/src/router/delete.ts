import {
  BadRequestError,
  OrderStatus,
  requireAuth,
  ValidationResult,
  NotAuthorizeError,
} from "@localmarket/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../model/order";
import { OrderCancelledEvent } from "../event/publisher/order-cancelled-event";
import { natConnection } from "../nat-wrapper";

const router = express.Router();

router.post(
  "/api/order/delete",
  requireAuth,
  [
    body("orderId")
      .not()
      .isEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("invalid orderId"),
  ],
  ValidationResult,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) throw new BadRequestError("order not found");
    //autorize
    if (order.userId.toString() !== req.currentUser!.id.toString())
      throw new NotAuthorizeError();

    //changing the order status
    order.set({
      orderStatus: OrderStatus.OrderCancelled,
    });
    //order save
    await order.save();
    //publish

    new OrderCancelledEvent(natConnection.client).publish({
      id: order.id,
      product: order.product,
      userId: order.userId,
      status:OrderStatus.OrderCancelled,
      version: order.version,
    });

    res.send('your order as been successfully cancelled.');
  }
);

export { router as deleteOrderRouter };
