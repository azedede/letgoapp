import express, { Request, Response } from "express";
import {
  requireAuth,
  ValidationResult,
  productStatus,
} from "@localmarket/common";
import { product } from "../model/product";
import { body } from "express-validator";
import { natConnection } from "../nat-client";
import { ProductEventCreated } from "../events/publisher/product-event-created";
import { uploader } from "../utility/uploader";
const router = express.Router();

router.post(
  "/api/product",
  requireAuth,
  
  [
    body("title").not().isEmpty().withMessage("error on  name feild"),
    body("price").isFloat({ gt: 0 }).withMessage("error on price field"),
    body("description").not().isEmpty().withMessage("error on description"),
  ],
  ValidationResult,
  uploader,
  async (req: Request, res: Response) => {
    const { title, price, description } = req.body;
    const { public_id, url } = req.imageData;
      console.log(req.body);
      
    const newProduct = product.build({
      title,
      description,
      price,
      status: productStatus.CREATED,
      owner: req.currentUser!.id,
      image: url,
      publicId:public_id
    });

    await newProduct.save();
    console.log(newProduct);
    

    //publish product to other services
    await new ProductEventCreated(natConnection.client).publish({
      description: newProduct.description,
      id: newProduct.id,
      price: newProduct.price,
      status: newProduct.status,
      title: newProduct.title,
      owner: req.currentUser!.id,
      image:newProduct.image,
      version: newProduct.version,
    });
    res.send("product uploaded succesfully");
  }
);

export { router as newProductRouter };
