import express, { Request, Response } from "express";
import {
  requireAuth,
  BadRequestError,
  NotAuthorizeError,
} from "@localmarket/common";
import { product } from "../model/product";
import { natConnection, natWrapper } from "../nat-client";
import { ProductEventDeleted } from "../events/publisher/product-event-deleted";

const router = express.Router();

router.post(
  "/api/product/delete",
  requireAuth,
  async (req: Request, res: Response) => {
    const { productId } = req.body;
    console.log(productId);

    const prod = await product.findById(productId);
    if (!prod) throw new BadRequestError("product not found");
    //check for authorization
    if (prod.owner.toString() !== req.currentUser!.id.toString())
      throw new NotAuthorizeError();
    //checking if product is not ordered already
    if (prod.orderId)
      throw new BadRequestError("unable to delete already ordered product");
    await prod.remove();
    //publish to other services
    new ProductEventDeleted(natConnection.client).publish({
      id: prod.id,
      owner: prod.owner,
      version: prod.version,
    });
    res.send(prod);
  }
);

export { router as productDeleteRouter };
