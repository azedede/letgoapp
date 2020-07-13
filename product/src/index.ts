import express from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import "express-async-errors";
import consola from "consola";
import { currentUser, NotFoundError, errorHandler } from "@localmarket/common";
import { natConnection } from "./nat-client";
import fileUploader from "express-fileupload";

//route inport
import { newProductRouter } from "./router/new";
import { productDeleteRouter } from "./router/delete";
import { updateProductRouter } from "./router/update";
import { productViewRouter } from "./router/view";
import { productIndexRouter } from "./router/index";
//nat listener
import { profileEventsCreated } from "./events/listener/profile-created-listener";
import { profileEventsUpdated } from "./events/listener/profile-updated-listener";
import { OrderCreatedEvent } from "./events/listener/order-created-listener";
import { OrderCancelledvent } from "./events/listener/order-cancelled-listener";
import mongoose from "mongoose";

const app = express();

//trusting uncoming traffic fron ngoinx
app.set("trust proxy", true);

// req data parser
app.use(json());
//image fileupload middleware
app.use(
  fileUploader({
    useTempFiles: true,
  })
);

//req session middleware
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

//global current logged user
app.use(currentUser);

//incoming route
app.use(newProductRouter);
app.use(productDeleteRouter);
app.use(updateProductRouter);
app.use(productIndexRouter);
app.use(productViewRouter);

//invalid route
app.all("*", () => {
  throw new NotFoundError();
});

//global error handler
app.use(errorHandler);

const start = async () => {
  console.log('starting .....');
  
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
  if (!process.env.CLOUD_KEY) {
    throw new Error("env cloudinary secret not created");
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

    //startin db
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    consola.success("product-depl connected to mongo");
    //event listener
    new profileEventsCreated(natConnection.client).listen();
    new profileEventsUpdated(natConnection.client).listen();
    new OrderCreatedEvent(natConnection.client).listen();
    new OrderCancelledvent(natConnection.client).listen();
  } catch (error) {
    consola.error(error.message);
  }

  app.listen(3000, () => {
    consola.success("prooduct-depl connected on port 3000");
  });
};

start();
