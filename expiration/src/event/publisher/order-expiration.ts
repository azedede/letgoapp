import { Subject, Publisher, orderExpirationEvent } from "@localmarket/common";

export class OrderExpiryEvent extends Publisher<orderExpirationEvent> {
  subject: orderExpirationEvent["subject"] = Subject.EXPIRATION_COMPLETED;
}
