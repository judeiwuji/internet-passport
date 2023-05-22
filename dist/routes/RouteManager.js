"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IndexRoute_1 = __importDefault(require("./IndexRoute"));
const UserRoute_1 = __importDefault(require("./UserRoute"));
const DeveloperRoute_1 = __importDefault(require("./DeveloperRoute"));
const VerificationRoute_1 = __importDefault(require("./VerificationRoute"));
class RouteManager {
    constructor(app) {
        this.app = app;
        this.register();
    }
    register() {
        this.app.use("", IndexRoute_1.default);
        this.app.use("", UserRoute_1.default);
        this.app.use("/developer", DeveloperRoute_1.default);
        this.app.use("", VerificationRoute_1.default);
    }
}
exports.default = RouteManager;
//# sourceMappingURL=RouteManager.js.map