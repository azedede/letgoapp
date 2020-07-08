import express, { Request, Response } from "express";
const router = express.Router();
import { profile } from "../model/profile";
import { body } from "express-validator";
import {uploader} from '../utility/uploader'
import {
  requireAuth,
  BadRequestError,
  NotAuthorizeError,
  ValidationResult,
} from "@localmarket/common";
import { natConnection } from "../nat-wrapper";
import { ProfileEventUpdate } from "../events/publisher/profile-event-updated";

router.put(
  "/api/profile",
  requireAuth,
  [
    body("username").not().isEmpty().withMessage("error in your username"),
    body("gsm")
      
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
    const Profile = await profile.findById(req.currentUser!.id);
     
    //? 
    if (!Profile) throw new BadRequestError("Profile not Found");
    
    //!authorization here
    if (Profile.id !== req.currentUser!.id) throw new NotAuthorizeError();
    const { username, gsm, brandName, location } = req.body;
    const {public_id,url}=req.imageData
    Profile.set({
      username,
      gsm,
      brandName,
      location,
      profilePic:url,
      publicId: public_id
    });

    await Profile.save();

    //publish profile updated to other services
    new ProfileEventUpdate(natConnection.client).publish({
      id: Profile.id,
      brandName: Profile.brandName,
      gsm: Profile.gsm,
      location: Profile.location,
      username: Profile.username,
      image:Profile.profilePic,
      version: Profile.version,
    });
    //return updated profile
    res.send("profile successfully updated");
  }
);

export {router as ProfileUpdateRouter}