"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_device_detector_1 = __importDefault(require("node-device-detector"));
const UserService_1 = __importDefault(require("../services/UserService"));
const validatorSchema_1 = __importDefault(require("../validators/validatorSchema"));
const UserSchema_1 = require("../validators/schemas/UserSchema");
const JWTUtils_1 = __importDefault(require("../utils/JWTUtils"));
const secretQuestions_1 = __importDefault(require("../data/secretQuestions"));
const VerificationService_1 = __importDefault(require("../services/VerificationService"));
const detector = new node_device_detector_1.default({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});
class IndexController {
    constructor() {
        this.userService = new UserService_1.default();
        this.verificationService = new VerificationService_1.default();
    }
    getHomePage(req, res) {
        // console.log(detector.detect(req.headers["user-agent"] as string));
        // console.log(req.useragent);
        console.log(JWTUtils_1.default.sign({
            payload: { email: "judeiwuji@gmail.com", codeSent: false },
        }));
        res.render("index", {
            page: {
                title: "Internet Passport",
                description: "Provides authentication as a service",
            },
            path: req.path,
        });
    }
    getSignupPage(req, res) {
        res.render("signup", {
            page: {
                title: "Signup - Internet Passport",
                description: "Create one identity for your net surfing",
            },
            path: req.path,
            questions: secretQuestions_1.default,
        });
    }
    userSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                const data = yield (0, validatorSchema_1.default)(UserSchema_1.UserCreationSchema, req.body);
                const user = yield this.userService.createUser(data);
                this.verificationService
                    .sendCode(user)
                    .then((info) => {
                    console.log(info);
                    const token = JWTUtils_1.default.sign({
                        payload: { email: user.email, codeSent: true },
                        expiresIn: "10m",
                    });
                    res.redirect(`/verifyEmail?state=${token}`);
                })
                    .catch((error) => {
                    console.debug(error);
                    const token = JWTUtils_1.default.sign({
                        payload: { email: user.email, codeSent: false },
                        expiresIn: "10m",
                    });
                    res.redirect(`/verifyEmail?state=${token}`);
                });
            }
            catch (error) {
                console.debug(error);
                res.render("signup", {
                    page: {
                        title: "Signup - Internet Passport",
                        description: "Create one identity for your net surfing",
                    },
                    path: req.path,
                    error,
                    data: req.body,
                    questions: secretQuestions_1.default,
                });
            }
        });
    }
    getDeveloperSignupPage(req, res) {
        res.render("developer/signup", {
            page: {
                title: "Developer Signup - Internet Passport",
                description: "Start integrating Internet Passsport into your applications",
            },
            path: req.path,
        });
    }
    getLoginPage(req, res) {
        res.render("login", {
            page: {
                title: "Login - Internet Passport",
                description: "Login into your Internet Passport",
            },
            path: req.path,
        });
    }
    getDeveloperLoginPage(req, res) {
        res.render("developer/login", {
            page: {
                title: "Developer Login - Internet Passport",
                description: "Login into your Internet Passport and start managing apps",
            },
            path: req.path,
        });
    }
}
exports.default = IndexController;
//# sourceMappingURL=IndexController.js.map