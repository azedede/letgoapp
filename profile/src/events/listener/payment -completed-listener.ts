import { Listener, Subject, orderPaymentEvent } from "@localmarket/common";
import { QueueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { profile } from "../../model/profile";

export class paymentCompletedListener extends Listener<orderPaymentEvent> {
  subject: orderPaymentEvent["subject"] = Subject.PAYMENT_COMPLETED;
  queueGroupName = QueueGroupName;

  async onMessage(data: orderPaymentEvent["data"], msg: Message) {
    const Profile = await profile.findById(data.productOwnerId);
    if (!Profile)
      throw new Error("profile service>> payment-completed-listener");

    const paymentDetails = {
      title: data.title,
      price: data.price,
      productId: data.productId,
    };

    Profile.business!.push(paymentDetails);
    //save
    await Profile.save();
    //ack
    msg.ack();
  }
}
