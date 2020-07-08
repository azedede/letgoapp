import mongoose, { Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface profileAttr {
  id: string;
  username: string;
  gsm: number;
  brandName: string;
  location: string;
  profilePic?: string;
}

interface profileDoc extends Document {
  username: string;
  gsm: number;
  brandName: string;
  location: string;
  profilePic: string;
  version: number;
}

interface profileModel extends Model<profileDoc> {
  build(attr: profileAttr): profileDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<profileDoc | null>;
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
    profilePic: {
      type: String,
      required: false,
      /* default:
        "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png", */
    },
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


profileSchema.statics.findByEvent = async(event:{id:string,version:number})=>{
   return await profile.findOne({_id:event.id, version:event.version-1})

}

profileSchema.statics.build = (attr: profileAttr) => {
  return new profile({
    _id: attr.id,
    username: attr.username,
    gsm: attr.gsm,
    brandName: attr.brandName,
    location: attr.location,
    profilePic: attr.profilePic,
  });
};

const profile = mongoose.model<profileDoc, profileModel>(
  "Profile",
  profileSchema
);

export { profile };
