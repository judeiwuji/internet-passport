import { Router } from "express";
import UserController from "../controllers/UserController";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/dashboard", (req, res) =>
  userController.getDashboard(req, res)
);
userRouter.get("/profile", userController.getProfile);
userRouter.put("/profile", (req, res) =>
  userController.updateProfile(req, res)
);
userRouter.post("/updateSecret", (req, res) =>
  userController.updateSecret(req, res)
);
export default userRouter;
