"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DeveloperController_1 = __importDefault(require("../controllers/DeveloperController"));
const developerRouter = (0, express_1.Router)();
const developerController = new DeveloperController_1.default();
developerRouter.get("/dashboard", developerController.getDashboard);
developerRouter.get("/profile", developerController.getProfile);
developerRouter.get("/applications/:id(\\d+)", developerController.getApplicationDetails);
exports.default = developerRouter;
//# sourceMappingURL=DeveloperRoute.js.map