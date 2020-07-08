import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, ValidationResult } from "@localmarket/common";
import { profile } from "../model/profile";
import { natConnection } from "../nat-wrapper";
import { ProfileEventCreated } from "../events/publisher/profile-event-created";
import {uploader} from '../utility/uploader'
const router = express.Router();

router.post(
  "/api/profile",
  requireAuth,
  [
    body("username").not().isEmpty().withMessage("error in your username"),
    body("gsm")
      .optional({ checkFalsy: true })
      .isNumeric()
      .isLength({ min: 10, max: 10 })
      .withMessage("mobile number length should 10 in characters"),
    body("brandName")
      .not()
      .isEmpty()
      .withMessage('error in "brand name" input'),
    body("location").not().isEmpty().withMessage("error in location feild"),
  ],
  ValidationResult,
  uploader,
  async (req: Request, res: Response) => {
    const { username, gsm, brandName, location } = req.body;
    const {public_id,url} = req.imageData
    const newProfile = profile.build({
      id: req.currentUser!.id,
      brandName,
      gsm,
      location,
      username,
      profilePic:url,
      publicId:public_id
    });

    //save
    await newProfile.save();
    //publish profile created to other services
    new ProfileEventCreated(natConnection.client).publish({
      id: newProfile.id,
      brandName: newProfile.brandName,
      gsm: newProfile.gsm,
      location: newProfile.location,
      username: newProfile.username,
      version: newProfile.version,
      image:newProfile.profilePic
    });

    return res.send("your profile as been successfully setup");
  }
);

export { router as ProfileRouter };
