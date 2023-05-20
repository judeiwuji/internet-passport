import { Application } from "express";
import indexRouter from "./IndexRoute";

export default class RouteManager {
  constructor(private app: Application) {
    this.register();
  }

  register() {
    this.app.use("", indexRouter);
  }
}
