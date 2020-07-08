import { Listener, Subject, productEventUpdated } from "@localmarket/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { product } from "../../model/product";

export class ProductEventUpdated extends Listener<productEventUpdated> {
  subject: productEventUpdated["subject"] = Subject.PRODUCT_UPDATED;
  queueGroupName = queueGroupName;

  async onMessage(data: productEventUpdated["data"], msg: Message) {
    const prod = await product.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!prod) throw new Error("product not found>>order-productupdtedlistener");
    prod.set({
      description: data.description,
      id: data.id,
      owner: data.owner,
      price: data.price,
      title: data.title,
      image:data.image
    });

    await prod.save();

    msg.ack();
  }
}
