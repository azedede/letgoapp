import { Listener, Subject, orderCreatedEvent } from "@localmarket/common";
import { order } from "../../model/order";
import { QueueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderCreatedEvent extends Listener<orderCreatedEvent> {
  subject: orderCreatedEvent["subject"] = Subject.ORDER_CREATED;
  queueGroupName = QueueGroupName;
  async onMessage(data: orderCreatedEvent["data"], msg: Message) {
    const Order = order.build({
      id: data.id,
      price: data.product.price,
      productId: data.product.id,
      productOwnerId: data.product.owner,
      status: data.status,
      title: data.product.title,
      userId: data.userId,
    });
    //save
    await Order.save();
    //ack()
    msg.ack();
  }
}
