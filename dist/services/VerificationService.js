"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodemailerUtils_1 = __importDefault(require("../utils/NodemailerUtils"));
const crypto_1 = __importDefault(require("crypto"));
class VerificationService {
    sendCode(user) {
        const verificationCode = crypto_1.default.randomInt(0, 1000000);
        const mailer = new NodemailerUtils_1.default();
        return mailer.send({
            html: `
    <p>Hi <strong>${user.firstname}</strong>, your verification code is:</p>
    <h1 style="text-align: center">${verificationCode}</h1>
    <br/>
    <p>
      <strong>Note:</strong>
      This verification code will expire after 10mins it was generated.
    </p>
    `,
            to: user.email,
            subject: "Internet Passport Verification Code",
        });
    }
}
exports.default = VerificationService;
//# sourceMappingURL=VerificationService.js.map