import express from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import "express-async-errors";
import consola from "consola";
import { currentUser, NotFoundError, errorHandler } from "@localmarket/common";
import { natConnection } from "./nat-wrapper";
import mongoose from "mongoose";

//listener import
import { OrderExpirationEvent } from "./event/listener/order-expiry-event";
import { ProductEventCreated } from "./event/listener/product-created-event";
import { ProductEventDeleted } from "./event/listener/product-deleted-event";
import { ProductEventUpdated } from "./event/listener/product-updated-event";

//router
import { newOrderRouter } from "./router/new";
import { viewOrderRouter } from "./router/view";
import { indexOrderRouter } from "./router/index";
import { deleteOrderRouter } from "./router/delete";
import { OrderCancelledEvent } from "./event/publisher/order-cancelled-event";

const app = express();

//trusting uncoming traffic fron ngoinx
app.set("trust proxy", true);

// req data parser
app.use(json());

//req session middleware
app.use(
  cookieSession({ 
    signed: false,
    secure: false,  
  }) 
);

//global current logged user
app.use(currentUser);

//router
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(viewOrderRouter);
app.use(indexOrderRouter);
//invalid route
app.all("*", () => {
  throw new NotFoundError();
});

//global error handler
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("env token is not created");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("env mongodb url is not created");
  }

  if (!process.env.NAT_URL) {
    throw new Error("env nat url is not created");
  }
  if (!process.env.NAT_CLUSTER_ID) {
    throw new Error("env nat cluster id is not created");
  }
  if (!process.env.NAT_CLIENT_ID) {
    throw new Error("env nat client id is not created");
  }
  try {
    await natConnection.connect(
      process.env.NAT_CLUSTER_ID,
      process.env.NAT_CLIENT_ID,
      process.env.NAT_URL
    );
    //on nat close
    natConnection.client.on("close", () => {
      consola.success("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natConnection.client.close());
    process.on("SIGTERM", () => natConnection.client.close());

    //listening for event fromother services
    new OrderExpirationEvent(natConnection.client).listen();
    new ProductEventCreated(natConnection.client).listen();
    new ProductEventDeleted(natConnection.client).listen();
    new ProductEventUpdated(natConnection.client).listen();

    //startin db
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    consola.success("order db connected to mongo");
  } catch (error) {
    consola.error(error.message);
  }

  app.listen(3000, () => {
    consola.success("prooduct-depl connected on port 3000");
  });
};

start();
