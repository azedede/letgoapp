import express, { Request, Response } from "express";
import {
  requireAuth,
  BadRequestError,
  OrderStatus,
  NotAuthorizeError,
} from "@localmarket/common";
import { order } from "../model/order";
import { payment } from "../model/payment";
import { OrderPaymentPublisher } from "../event/publisher/payment-succesful-event";
import { natConnection } from "../nat-client";

const router = express.Router();

router.post(
  "/api/payment",
  requireAuth,
  async (res: Response, req: Request) => {
    const { refId, orderId } = req.body;

    const isOrder = await order.findById(orderId);
    if (!isOrder)
      throw new Error("order not found >> payment service [order model]");

    //checkk if order is still active
    if (isOrder.status === OrderStatus.OrderCancelled)
      throw new BadRequestError("Order you purchasing as timedout");

    //authorization
    if (isOrder.userId.toString() !== req.currentUser!.id.toString())
      throw new NotAuthorizeError();

    //saving successfull payment to [payment database]
    const Payment = payment.build({
      order: isOrder.id,
      paymentId: refId,
      userId: isOrder.userId,
    });

    //save
    await Payment.save();



    //publish
    new OrderPaymentPublisher(natConnection.client).publish({
      orderId: isOrder.id,
      productId:isOrder.productId,
      productOwnerId:isOrder.productOwnerId,
      title:isOrder.title,
      price:isOrder.price,
      userId:isOrder.userId
    });

    res.send(
      "payment successfull"
    );
  }
);
