import { Application } from "express";
import indexRouter from "./IndexRoute";
import userRouter from "./UserRoute";
import developerRouter from "./DeveloperRoute";
import verificationRouter from "./VerificationRoute";

export default class RouteManager {
  constructor(private app: Application) {
    this.register();
  }

  register() {
    this.app.use("", indexRouter);
    this.app.use("", userRouter);
    this.app.use("/developer", developerRouter);
    this.app.use("", verificationRouter);
  }
}
