import { Router } from "express";
import ClientAppController from "../controllers/ClientAppController";

const clientAppRoute = Router();
const clientAppController = new ClientAppController();

clientAppRoute.post("/apps", (req, res) =>
  clientAppController.createApp(req, res)
);

clientAppRoute.get("/apps", (req, res) =>
  clientAppController.getApps(req, res)
);

clientAppRoute.get("/apps/:id", (req, res) =>
  clientAppController.getApp(req, res)
);

clientAppRoute.put("/apps/:id", (req, res) =>
  clientAppController.updateApp(req, res)
);

clientAppRoute.delete("/apps/:id", (req, res) =>
  clientAppController.deleteApp(req, res)
);

export default clientAppRoute;
