import express, { Request, Response } from "express";
import { product } from "../model/product";


const router = express.Router();

router.get('/api/product',async(req:Request,res:Response)=>{
  const products = await product.find({})

  return res.send(products)
  
})

export {router as productIndexRouter}