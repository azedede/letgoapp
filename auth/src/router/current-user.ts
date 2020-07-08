import express, { Request, Response } from "express";
import { user } from "../model/user";
import { currentUser } from "@localmarket/common";

const router = express();

router.get(
  "/api/user/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentuser: req.currentUser || null });
  }
);

export { router as currentUserRoute };
