import { Listener, Subject, productEventCreated } from "@localmarket/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { product } from "../../model/product";

export class ProductEventCreated extends Listener<productEventCreated> {
  subject: productEventCreated["subject"] = Subject.PRODUCT_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: productEventCreated["data"], msg: Message) {
    const prod = product.build({
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
