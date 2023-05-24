import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/changePassword", (req, res) =>
  authController.changePassword(req, res)
);

authRouter.post("/logout", (req, res) => authController.logout(req, res));
authRouter.post("/login", (req, res) => authController.login(req, res));
authRouter.get("/identity/challenge", (req, res) =>
  authController.getIdentityChallengePage(req, res)
);
authRouter.post("/identity/challenge", (req, res) =>
  authController.processIdentityChallenge(req, res)
);
export default authRouter;
