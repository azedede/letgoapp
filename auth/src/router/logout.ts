import express,{Response,Request} from 'express'
const router = express.Router()


 router.post('/api/user/logout',(req:Request,res:Response)=>{
    req.session = null
    return res.send('you have successfully logout.')
 })

export {router as LogoutRouter}
