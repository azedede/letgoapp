import express from "express";
import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@localmarket/common";
import "express-async-errors";
import cookieSession from "cookie-session";
import consola from "consola";
//route import
import { signupRouter } from "./router/signup";
import { signinRouter } from "./router/login";
import { currentUserRoute } from "./router/current-user";
import { LogoutRouter } from "./router/logout";
import mongoose from "mongoose";

const app = express();

app.set("trust proxy", true); //
//body-parser middleware
app.use(json());

//session middleware
app.use(  
  cookieSession({
    signed: false,
    secure: false,  
  })
);

//routing
app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRoute);
app.use(LogoutRouter);

//handling all invalid routes
app.all("*", () => {
  throw new NotFoundError();
});

//applying error middleware
app.use(errorHandler);

const start = async () => {
  console.log('starting server....');
  
  if (!process.env.JWT_KEY) {
    throw new Error("env token is not created");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("env mongodb url is not created");
  }
  try {
    //startin db
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    consola.success("auth-depl  connected to mongodb");
  } catch (error) {
    consola.error(error.message);
  }
  app.listen("3000", () => {
    console.log("auth-depl connected on port 3000");
  });
};

start();
