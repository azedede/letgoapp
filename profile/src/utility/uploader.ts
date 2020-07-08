//@ts-ignore
import { Request, Response, NextFunction } from "express";
const cloudinary = require("cloudinary").v2;
import { BadRequestError } from "@localmarket/common";

interface Data {
  url: string;
  public_id: string;
}

declare global {
  namespace Express {
    interface Request {
      imageData: Data;
    }
  }
}

export const uploader = (req: Request, res: Response, next: NextFunction) => {
  if (req.files === null) {
    throw new BadRequestError("yuck!!... please upload an image");
  }
  console.log(req.files!.file);

  //cloudinary config
  cloudinary.config({
    cloud_name: "dgyuwuapc",
    api_key: 438264627998199,
    api_secret: process.env.CLOUD_KEY,
  });
  console.log(req.files, req.body);

  //getting the file from express uploader
  const file = req.files!.file;
  //cloudinary image props
  const properties = {
    public_id: req.body.publicId,
    quality: "90",
    width: 250,
    crop: "scale",
  };

  //starting uploads
  cloudinary.uploader.upload(
    //@ts-ignore
    file.tempFilePath,
    properties,
    (err: any, result: { url: string; public_id: string }) => {
      if (!err) {
        req.imageData = {
          url: result.url,
          public_id: result.public_id,
        };
        next();
      } else {
        console.log(err);
        throw new BadRequestError("error upload uploading your file");
      }
    }
  );
};
