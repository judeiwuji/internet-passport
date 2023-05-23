import { Application } from "express";
import indexRoute from "./IndexRoute";
import userRoute from "./UserRoute";
import developerRoute from "./DeveloperRoute";
import verificationRoute from "./VerificationRoute";
import authRoute from "./AuthRoute";
import clientAppRoute from "./ClientAppRoute";

export default class RouteManager {
  constructor(private app: Application) {
    this.register();
  }

  register() {
    this.app.use("", indexRoute);
    this.app.use("", userRoute);
    this.app.use("/developer", developerRoute);
    this.app.use("", verificationRoute);
    this.app.use("", authRoute);
    this.app.use("/client", clientAppRoute);
  }
}
