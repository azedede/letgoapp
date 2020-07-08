import mongoose, { Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface profileAttr {
  id: string;
  username: string;
  gsm: number;
  brandName: string;
  location: string;
  profilePic: string;
  publicId?:string
  business?: Array<{}>;
}

interface profileDoc extends Document {
  username: string;
  gsm: number;
  brandName: string;
  location: string;
  profilePic: string;
  version: number;
  publicId:string
  business?: Array<{}>;
}

interface profileModel extends Model<profileDoc> {
  build(attr: profileAttr): profileDoc;
}

const profileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    gsm: {
      type: Number,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    business: {
      type: Array,
    },
    profilePic: {
      type: String,
      required: false,
      default:
        "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
    },
    publicId:{
      type:String
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

profileSchema.set("versionKey", "version");
profileSchema.plugin(updateIfCurrentPlugin);

profileSchema.statics.build = (attr: profileAttr) => {
  return new profile({
    _id: attr.id,
    username: attr.username,
    gsm: attr.gsm,
    brandName: attr.brandName,
    location: attr.location,
    profilePic: attr.profilePic,
    publicId:attr.publicId,
    business: attr.business,
  });
};

const profile = mongoose.model<profileDoc, profileModel>(
  "Profile",
  profileSchema
);

export { profile };
