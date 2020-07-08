import { Publisher, Subject, orderCancelledEvent } from "@localmarket/common";
export class OrderCancelledEvent extends Publisher<orderCancelledEvent> {
  subject: orderCancelledEvent["subject"] = Subject.ORDER_CANCELLED;
}
