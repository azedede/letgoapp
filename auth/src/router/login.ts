import express, { Request, Response } from "express";
import { user } from "../model/user";
import { body } from "express-validator";
import { passwordManager } from "../services/password-manager";
import {
  ValidationResult,
  BadRequestError,
  accountStatus,
} from "@localmarket/common";

import jwt from "jsonwebtoken";
const JWT_SECRET = "ahdhrrbrjrij8484489443";
const router = express.Router();

router.post(
  "/api/user/signin",
  [
    body("email").isEmail().withMessage("check your email address"),
    body("password").notEmpty().withMessage("password feild empty"),
  ],
  ValidationResult,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    //check user exist
    const existingUser = await user.findOne({ email });
    if (!existingUser) throw new BadRequestError("incorrect email or password");

    //comparing password
    const passwordMatch = await passwordManager.compareHash(
      existingUser.password,
      password
    );

    if (!passwordMatch)
      throw new BadRequestError("incorrect email or password");

    //check barn status

    if (existingUser.status === accountStatus.accountDisabled)
      throw new BadRequestError("Account Disabled");

    //create payload
    const payload = jwt.sign(
      { 
        id: existingUser.id,
        name: existingUser.name,
        email:existingUser.email, 
        role:existingUser.status
      },
      JWT_SECRET
    );
    //save payload in session
    req.session!.jwt = payload;

    return res.send(existingUser);
  }
);

export { router as signinRouter };
