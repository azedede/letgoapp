import express, { Request, Response } from "express";
import { ValidationResult, BadRequestError } from "@localmarket/common";

import { body } from "express-validator";
import { user } from "../model/user";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/user/signup",
  [
    body("email").isEmail().withMessage("check your email address"),
    body("name").not().isEmpty().withMessage("name cannot be empty"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 12 })
      .withMessage("password must set between 6 or 20 character"),
  ],
  ValidationResult,
  async (req: Request, res: Response) => {
    const { email, password, password2, name } = req.body;

    if (password !== password2) {
      throw new BadRequestError("password does not match");
    }

    const isAvailable = await user.findOne({ email });
    if (isAvailable) {
      throw new BadRequestError("Email already taken");
    }
    const newUser = user.build({
      email,
      password,
      name,
    });
    await newUser.save();

    //generate token
    const payload = jwt.sign(
      {
        id: newUser.id,
        email: newUser.name,
        role: newUser.status,
      },
      process.env.JWT_KEY!
    );

    //storing token inside session middleware
    //req.session!.jwt = payload;

    console.log("user created");

    res.status(201).send(newUser);
  }
);

export { router as signupRouter };
