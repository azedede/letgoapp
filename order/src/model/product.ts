import mongoose, { Document, Model } from "mongoose";
import { Order } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@localmarket/common";

interface productAttr {
  id: string;
  title: string;
  price: number;
  description: string;
  owner: string;
  image:string
}

interface productDoc extends Document {
  id: string;
  title: string;
  price: number;
  description: string;
  owner: string;
  version: number;
  image:string
  isReserved(): Promise<Boolean>;
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

    owner: {
      type: String,
      required: true,
    },
    image:{
      type:String,
      required:true
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

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attr: productAttr) => {
  return new product({
    _id: attr.id,
    description: attr.description,
    title: attr.title,
    price: attr.price,
    owner: attr.owner,
    image: attr.image
  });
};

productSchema.methods.isReserved = async function () {
  const isOrderReserved = await Order.findOne({
    product: this, //id of the product
    orderStatus: {
      $in: [
        OrderStatus.OrderCompleted,
        OrderStatus.OrderAwaitingPayment,
        OrderStatus.OrderCreated,
      ],
    },
  });
  return !!isOrderReserved;
};

const product = mongoose.model<productDoc, productModel>(
  "Product",
  productSchema
);

export { product };
