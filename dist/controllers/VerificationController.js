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
const VerificationService_1 = __importDefault(require("../services/VerificationService"));
const JWTUtils_1 = __importDefault(require("../utils/JWTUtils"));
const UserService_1 = __importDefault(require("../services/UserService"));
class VerificationController {
    constructor() {
        this.verificationService = new VerificationService_1.default();
        this.userService = new UserService_1.default();
    }
    getVerifyEmailPage(req, res) {
        const state = req.query.state;
        let isStateValid = true;
        let jwtData;
        try {
            jwtData = JWTUtils_1.default.verify({ token: state });
            console.log(jwtData);
        }
        catch (error) {
            console.log(error);
            isStateValid = false;
        }
        res.render("verifyEmail", {
            page: {
                title: "Verify account email - Internet Passport",
                description: "We use your email to confirm your identity",
            },
            path: req.path,
            isStateValid,
            data: jwtData ? jwtData.payload : {},
        });
    }
    resendVerificationCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                const token = JWTUtils_1.default.sign({ payload: { email, codeSent: false } });
                return res.redirect(`/verifyEmail?state=${token}`);
            }
            try {
                const user = yield this.userService.getUserBy({ email });
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
                const token = JWTUtils_1.default.sign({ payload: { email, codeSent: false } });
                return res.redirect(`/verifyEmail?state=${token}`);
            }
        });
    }
}
exports.default = VerificationController;
//# sourceMappingURL=VerificationController.js.map