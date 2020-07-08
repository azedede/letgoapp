import mongoose, { Document, Model } from "mongoose";
import { productStatus } from "@localmarket/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface productAttr {
  title: string;
  price: number;
  description: string;
  status: productStatus;
  owner: string;
  orderId?: string;
  image: string;
  publicId?:string
}

interface productDoc extends Document {
  title: string;
  price: number;
  description: string;
  image: string;
  publicId:string
  status: productStatus;
  orderId: string;
  owner: string;
  version: number;
}

interface productModel extends Model<productDoc> {
  build(attr: productAttr): productDoc;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    publicId:{
      type:String
    },
    status: {
      type: String,
      enum: Object.values(productStatus),
      default: productStatus.CREATED,
    },

    orderId: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
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

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attr: productAttr) => {
  return new product(attr);
};

const product = mongoose.model<productDoc, productModel>(
  "Product",
  productSchema
);

export { product };
