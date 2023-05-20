import { Router } from "express";
import IndexController from "../controllers/IndexController";

const indexRouter = Router();
const indexController = new IndexController();

indexRouter.get("/", indexController.getHomePage);
indexRouter.get("/signup", indexController.getSignupPage);
indexRouter.get("/login", indexController.getLoginPage);
export default indexRouter;
