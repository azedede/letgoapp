//import listener
import { OrderCreatedEvent } from "./event/listener/order-created-listener";

//nats connection
import { natConnection } from "./nat-wrapper";

const start = async () => {
  console.log('stating.....');  
  
  //env variable checks

  if (!process.env.NAT_CLIENT_ID)
    throw new Error("nat client id is not created");
  if (!process.env.NAT_CLUSTER_ID)
    throw new Error("nat cluster id is not created");
  if (!process.env.NAT_URL) throw new Error("nat url is not created");

  try {
    await natConnection.connect(
      process.env.NAT_CLUSTER_ID,
      process.env.NAT_CLIENT_ID,
      process.env.NAT_URL
    );
    natConnection.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natConnection.client.close());
    process.on("SIGTERM", () => natConnection.client.close());

    new OrderCreatedEvent(natConnection.client).listen();
  } catch (error) {
    console.log(error);
  }
};

start();
