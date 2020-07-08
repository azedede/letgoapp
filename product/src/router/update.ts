import express, { Request, Response } from "express";
import {
  requireAuth,
  ValidationResult,
  BadRequestError,
  NotAuthorizeError,
  NotFoundError,
} from "@localmarket/common";
import { product } from "../model/product";
import { body } from "express-validator";
import { natConnection } from "../nat-client";
import { ProductEventUpdated } from "../events/publisher/product-event-updated";
import {uploader} from '../utility/uploader'
const router = express.Router();

router.put(
  "/api/product/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("check title feild"),
    body("price").isFloat({ gt: 0 }).withMessage("check price field"),
    body("description").not().isEmpty().withMessage("error on description"),
  ],
  uploader,
  ValidationResult,
  
  async (req: Request, res: Response) => {
    const { title, price, description } = req.body;
    const {url,public_id}= req.imageData
    const p = await product.findById(req.params.id);
    if (!p) throw new BadRequestError("product not found");
    
    //check if order on this product is active
    if(p.orderId !== undefined) throw new BadRequestError("ordering in progress...unable to edit")

    if (p.owner.toString() !== req.currentUser!.id.toString())
      throw new NotAuthorizeError();
    p.set({
      title,
      price,
      description,
      publicId:public_id,
      image:url
    });

    await p.save();
    //publish update to other service
    new ProductEventUpdated(natConnection.client).publish({
      description: p.description,
      id: p.id,
      price: p.price,
      status: p.status,
      title: p.title,
      owner: p.owner,
      image:p.image,
      version: p.version, 
    });

    res.send('product updated successfully!!')
  }
);
export { router as updateProductRouter };
