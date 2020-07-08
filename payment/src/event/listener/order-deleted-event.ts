import {
  Listener,
  Subject,
  orderCancelledEvent,
} from "@localmarket/common";
import { order } from "../../model/order";
import { QueueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderCancelledEvent extends Listener<orderCancelledEvent> {
  subject: orderCancelledEvent["subject"] = Subject.ORDER_CANCELLED;
  queueGroupName = QueueGroupName;
  async onMessage(data: orderCancelledEvent["data"], msg: Message) {
    const Order = await order.findById(data.id);
    if (!Order)
      throw new Error(
        "order not found>> payment services>> event order deleted"
      );

    Order.set({
      status: data.status,
    });

    await Order.save();
    //ack()
    msg.ack();
  }
}
