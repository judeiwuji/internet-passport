import { Router } from "express";
import DeveloperController from "../controllers/DeveloperController";

const developerRouter = Router();
const developerController = new DeveloperController();

developerRouter.get("/dashboard", (req, res) =>
  developerController.getDashboard(req, res)
);
developerRouter.get("/profile", developerController.getProfile);
developerRouter.get("/login", developerController.getLoginPage);
developerRouter.get("/signup", developerController.getSignupPage);
developerRouter.post("/signup", (req, res) =>
  developerController.signup(req, res)
);
developerRouter.put("/profile", (req, res) =>
  developerController.updateProfile(req, res)
);
export default developerRouter;
