import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/changePassword", (req, res) =>
  authController.changePassword(req, res)
);

authRouter.post("/logout", (req, res) => authController.logout(req, res));
authRouter.post("/login", (req, res) => authController.login(req, res));
authRouter.get("/login/auth/identity/challenge", (req, res) =>
  authController.getIdentityChallengePage(req, res)
);
authRouter.post("/login/auth/identity/challenge", (req, res) =>
  authController.processIdentityChallenge(req, res)
);
authRouter.get("/login/auth/consent", (req, res) =>
  authController.getUserAppConsentPage(req, res)
);
authRouter.post("/login/auth/consent", (req, res) =>
  authController.processUserAppConsent(req, res)
);
export default authRouter;
