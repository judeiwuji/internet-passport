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
export default developerRouter;
