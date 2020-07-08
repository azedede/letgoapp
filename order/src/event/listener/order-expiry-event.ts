import {
  Subject,
  orderExpirationEvent,
  Listener,
  orderCancelledEvent,
} from "@localmarket/common";
import { Order, OrderStatus } from "../../model/order";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "../publisher/order-cancelled-event";

export class OrderExpirationEvent extends Listener<orderExpirationEvent> {
  subject: orderExpirationEvent["subject"] = Subject.EXPIRATION_COMPLETED;
  queueGroupName = queueGroupName;
  async onMessage(data: orderExpirationEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error("order not found >> order services");

    if (order.orderStatus === OrderStatus.OrderCompleted) msg.ack();
    order.set({
      orderStatus: OrderStatus.OrderExpired,
    });

    //save
    await order.save();
    //publish event
    new OrderCancelledEvent(this.client).publish({
      id: order.id,
      product: order.product,
      userId: order.userId,
      version: order.version,
      status:order.orderStatus
    
    });
    //ack the message
    msg.ack();
  }
}
