import express, { Request, Response } from "express";
import { product } from "../model/product";
import { BadRequestError } from "@localmarket/common";


const router = express.Router();

router.get('/api/product/:productId',async(req:Request,res:Response)=>{
  const prod = await product.findById(req.params.productId).populate('owner')
  if(!prod) throw new BadRequestError('product not found')
  return res.send(prod)
  
})

export {router as productViewRouter}