"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const IndexController_1 = __importDefault(require("../controllers/IndexController"));
const indexRouter = (0, express_1.Router)();
const indexController = new IndexController_1.default();
indexRouter.get("/", indexController.getHomePage);
indexRouter.get("/signup", indexController.getSignupPage);
indexRouter.post("/signup", (req, res) => indexController.userSignup(req, res));
indexRouter.get("/login", indexController.getLoginPage);
indexRouter.get("/developer/signup", indexController.getDeveloperSignupPage);
indexRouter.get("/developer/login", indexController.getDeveloperLoginPage);
exports.default = indexRouter;
//# sourceMappingURL=IndexRoute.js.map