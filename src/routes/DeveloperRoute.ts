import { Router } from "express";
import DeveloperController from "../controllers/DeveloperController";

const developerRouter = Router();
const developerController = new DeveloperController();

developerRouter.get("/dashboard", developerController.getDashboard);
developerRouter.get("/profile", developerController.getProfile);
developerRouter.get(
  "/applications/:id(\\d+)",
  developerController.getApplicationDetails
);
developerRouter.get("/login", developerController.getLoginPage);
developerRouter.get("/signup", developerController.getSignupPage);
developerRouter.post("/signup", (req, res) =>
  developerController.signup(req, res)
);
export default developerRouter;
