import express from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import "express-async-errors";
import consola from "consola";
import { currentUser, NotFoundError, errorHandler } from "@localmarket/common";
import { natConnection } from "./nat-client";

import mongoose from "mongoose";

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

    //startin db
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    consola.success("administor-depl connected to mongo");
  } catch (error) {
    consola.error(error.message);
  }

  app.listen(3000, () => {
    consola.success("administrator-depl connected on port 3000");
  });
};

start();
