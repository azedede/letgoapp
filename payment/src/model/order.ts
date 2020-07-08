import mongose, { Model, Document } from "mongoose";

interface ordertAttr {
  id: string;
  title: string;
  price: number;
  productId: string;
  status: string;
  userId: string;
  productOwnerId: string;
}

interface orderDocs extends Document {
  id: string;
  title: string;
  price: number;
  status: string;
  productId: string;
  userId: string;
  productOwnerId: string;
}

interface orderModel extends Model<orderDocs> {
  build(attr: ordertAttr): orderDocs;
}

const orderSchema = new mongose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    productOwnerId: {
      type: String,
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

orderSchema.statics.build = (attr: ordertAttr) => {
  return new order({
    _id: attr.id,
    price: attr.price,
    productId: attr.productId,
    title: attr.title,
    userId: attr.userId,
    status: attr.status,
  });
};

const order = mongose.model<orderDocs, orderModel>("Order", orderSchema);
export { order };
