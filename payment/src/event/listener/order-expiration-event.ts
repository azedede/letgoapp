import {
    Listener,
    Subject,
    orderExpirationEvent,
    OrderStatus,
  } from "@localmarket/common";
  import { order } from "../../model/order";
  import { QueueGroupName } from "./queue-group-name";
  import { Message } from "node-nats-streaming";
  
  export class OrderExpirationEvent extends Listener<orderExpirationEvent> {
    subject: orderExpirationEvent["subject"] = Subject.EXPIRATION_COMPLETED;
    queueGroupName = QueueGroupName;
    async onMessage(data: orderExpirationEvent["data"], msg: Message) {
      const Order = await order.findById(data.orderId);
      if (!Order)
        throw new Error(
          "order not found>> payment services>>order-expiration-event"
        );
  
      Order.set({
        status: data.status,
      });
  
      await Order.save();
      //ack()
      msg.ack();
    }
  }
  