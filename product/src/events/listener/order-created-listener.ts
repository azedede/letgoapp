import {
  Listener,
  orderCreatedEvent,
  Subject,
  productStatus,
} from "@localmarket/common";
import { product } from "../../model/product";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { ProductEventUpdated } from "../publisher/product-event-updated";

export class OrderCreatedEvent extends Listener<orderCreatedEvent> {
  subject: orderCreatedEvent["subject"] = Subject.ORDER_CREATED;
  queueGroupName = queueGroupName;
  async onMessage(data: orderCreatedEvent["data"], msg: Message) {
    const prod = await product.findById(data.product.id);
    if (!prod)
      throw new Error("product not found>>ordercreated>>product service");
    prod.set({
      orderId: data.id,
      status: productStatus.AWAITING_PAYMENT,
    });
    //save
    await prod.save();
    //publish changes in event to other product services
    new ProductEventUpdated(this.client).publish({
      description: prod.description,
      id: prod.id,
      owner: prod.owner,
      price: prod.price,
      status: prod.status,
      title: prod.title,
      version: prod.version,
      image:prod.image
    });

    //ack
    msg.ack();
  }
}
