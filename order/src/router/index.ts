import express,{Request,Response} from 'express'
import {requireAuth} from '@localmarket/common'
import {Order} from '../model/order'
const router = express.Router()


router.get('/api/order',requireAuth,async(req:Request,res:Response)=>{
   const orders = await Order.find({userId:req.currentUser!.id}).populate("product")
   res.send(orders)
})

export {router as indexOrderRouter }