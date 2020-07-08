import {
  Listener,
  orderCancelledEvent,
  Subject,
  productStatus,
} from "@localmarket/common";
import { product } from "../../model/product";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { ProductEventUpdated } from "../publisher/product-event-updated";

export class OrderCancelledvent extends Listener<orderCancelledEvent> {
  subject: orderCancelledEvent["subject"] = Subject.ORDER_CANCELLED;
  queueGroupName = queueGroupName;
  async onMessage(data: orderCancelledEvent["data"], msg: Message) {
    const prod = await product.findById(data.product);
    if (!prod)
      throw new Error("product not found>>ordercancelled>>product service");
    prod.set({
      orderId: undefined,
      status: productStatus.CREATED,
    });
    //save
    await prod.save();

    //publish product changes to other services
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
