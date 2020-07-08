import { Subject, Listener, orderCreatedEvent } from "@localmarket/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedEvent extends Listener<orderCreatedEvent> {
  subject: orderCreatedEvent["subject"] = Subject.ORDER_CREATED;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: orderCreatedEvent["data"], msg: Message) {
    //calculating time frame
    const delay = new Date(data.expiry).getTime() - new Date().getTime();

    console.log(`waiting ..for order:${data.id} of time ${delay} to expire`);

    //add pending job to bull
    await expirationQueue.add({ orderId: data.id }, { delay });
    //ack msg
    msg.ack();
  }
}
