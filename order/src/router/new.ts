import express, { Request, Response } from "express";
import {
  requireAuth,
  ValidationResult,
  BadRequestError,
} from "@localmarket/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { product } from "../model/product";
import { Order, OrderStatus } from "../model/order";
import { OrderCreatedEvent } from "../event/publisher/order-created-event";
import { natConnection } from "../nat-wrapper";

const router = express.Router();
const EXPIRATION_WINDOW = 15 * 60;

router.post(
  "/api/order/new",
  requireAuth,
  [
    body("productId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("invalid productId"),
  ],
  ValidationResult,
  async (req: Request, res: Response) => {
    const { productId } = req.body;
    const Product = await product.findById(productId);
    if (!Product) throw new BadRequestError("product not found.");
    //checks for if order reservered
    const isReserved = await Product.isReserved();
    if (isReserved)
      throw new BadRequestError("This product is reserved by someone.");
    // create an expiry window timeout
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW);

    //saving into order collections
    const order = Order.build({
      expiry: expiration,
      product: Product,
      orderStatus: OrderStatus.OrderCreated,
      userId: req.currentUser!.id,
    });
    
    
    //save
    await order.save();
    //publish
    new OrderCreatedEvent(natConnection.client).publish({
      id: order.id,
      product: Product,
      userId: req.currentUser!.id,
      version: order.version,
      status:order.orderStatus,
      expiry: order.expiry,
    });

    res.status(201).send(order)
  }
);

export { router as newOrderRouter };
