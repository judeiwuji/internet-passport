import { Router } from "express";
import UserController from "../controllers/UserController";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/dashboard", userController.getDashboard);
userRouter.get("/profile", userController.getProfile);
export default userRouter;
