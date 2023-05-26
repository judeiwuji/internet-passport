import AppConfig from "../config/appConfig";
import User from "../models/User";
import NodemailerUtils from "../utils/NodemailerUtils";
import crypto from "crypto";

export default class VerificationService {
  async sendCode(user: User) {
    const verificationCode = crypto.randomInt(0, 1000000);
    const mailer = new NodemailerUtils();
    console.log(`\nCode: ${verificationCode}\n`);
    await mailer.send({
      html: `
    <h1 style="font-weight: 700; font-size: 1.5rem">${AppConfig.appName}</h1>
    <br>
    <br>
    <p>Hi <strong>${user.firstname}</strong>, your verification code is:</p>
    <h1 style="text-align: center">${verificationCode}</h1>
    <br/>
    <p>
      <strong>Note:</strong>
      This verification code will expire after 10 minutes it was generated.
    </p>
    `,
      to: user.email,
      subject: `${AppConfig.appName} Verification Code`,
    });
    return verificationCode;
  }
}
