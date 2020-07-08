import { Subject, orderPaymentEvent, Publisher } from "@localmarket/common";

export class OrderPaymentPublisher extends Publisher<orderPaymentEvent> {
  subject: orderPaymentEvent["subject"] = Subject.PAYMENT_COMPLETED;
}
