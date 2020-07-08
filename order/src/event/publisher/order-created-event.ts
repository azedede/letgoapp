import { Publisher, Subject, orderCreatedEvent } from "@localmarket/common";
export class OrderCreatedEvent extends Publisher<orderCreatedEvent> {
  subject: orderCreatedEvent["subject"] = Subject.ORDER_CREATED;
}
