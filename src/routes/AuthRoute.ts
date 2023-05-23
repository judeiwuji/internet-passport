import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/changePassword", (req, res) =>
  authController.changePassword(req, res)
);

authRouter.post("/logout", (req, res) => authController.logout(req, res));
export default authRouter;
