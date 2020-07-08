import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@localmarket/common";
import { profile } from "../model/profile";
import consola from "consola";

const router = express.Router();

router.get("/api/profile", requireAuth, async (req: Request, res: Response) => {
  const viewProfile = await profile.findById(req.currentUser!.id);
 
  
 return res.send(viewProfile);
});
export { router as viewProfileRouter };
