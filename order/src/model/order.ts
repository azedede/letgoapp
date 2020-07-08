import mongoose, { Model, Document } from "mongoose";
import { OrderStatus } from "@localmarket/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
export {OrderStatus}
interface orderAttr {
  userId: string;
  orderStatus: OrderStatus;
  product: any;
  expiry: Date;
}

interface orderDocs extends Document {
  userId: string;
  orderStatus: OrderStatus;
  product: any;
  expiry: Date;
  version:number
}

interface orderModel extends Model<orderDocs> {
  build(attr: orderAttr): orderDocs;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required:true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.OrderCreated,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    expiry: {
      type: mongoose.Schema.Types.Date,
      required: true,
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
OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attr: orderAttr) => {
 return new Order(attr);
};

const Order = mongoose.model<orderDocs, orderModel>("Order", OrderSchema);
export { Order };
