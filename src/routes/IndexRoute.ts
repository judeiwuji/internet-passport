import { Router } from "express";
import IndexController from "../controllers/IndexController";

const indexRouter = Router();
const indexController = new IndexController();

indexRouter.get("/", indexController.getHomePage);
export default indexRouter;
