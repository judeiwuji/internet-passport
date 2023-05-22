"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerificationController_1 = __importDefault(require("../controllers/VerificationController"));
const verificationRouter = (0, express_1.Router)();
const verificationController = new VerificationController_1.default();
verificationRouter.get("/verifyEmail", (req, res) => verificationController.getVerifyEmailPage(req, res));
verificationRouter.post("/resend/verificationCode", (req, res) => verificationController.resendVerificationCode(req, res));
exports.default = verificationRouter;
//# sourceMappingURL=VerificationRoute.js.map