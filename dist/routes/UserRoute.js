"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const userRouter = (0, express_1.Router)();
const userController = new UserController_1.default();
userRouter.get("/dashboard", userController.getDashboard);
userRouter.get("/profile", userController.getProfile);
exports.default = userRouter;
//# sourceMappingURL=UserRoute.js.map