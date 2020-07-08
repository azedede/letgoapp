import Queue from "bull";
import { OrderExpiryEvent } from "../event/publisher/order-expiration";
import { natConnection } from "../nat-wrapper";
import {OrderStatus} from '@localmarket/common'

interface payload {
  orderId: string;
}

const expirationQueue = new Queue<payload>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job) => {
  console.log("queue published expired order:order expired", job.data.orderId);

  //publishing expired event
  new OrderExpiryEvent(natConnection.client).publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };
