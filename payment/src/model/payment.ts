import mongose, { Model, Document } from "mongoose";

interface paymentAttr {
  order: string;
  userId: string;

  paymentId: string;
}

interface paymentDocs extends Document {
  order: string;
  userId: string;
  paymentId: string;
  
}

interface paymentModel extends Model<paymentDocs> {
  build(attr: paymentAttr): paymentDocs;
}

const paymentSchema = new mongose.Schema(
  {
    order: {
      type: mongose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    userId: {
      type: String,
      required: true,
    },
    productId: { type: String, required: true },

    paymentId: {
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

paymentSchema.statics.build = (attr: paymentAttr) => {
  return new payment(attr);
};

const payment = mongose.model<paymentDocs, paymentModel>(
  "Payment",
  paymentSchema
);
export { payment };
