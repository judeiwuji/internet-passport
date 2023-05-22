import User from "../models/User";
import NodemailerUtils from "../utils/NodemailerUtils";
import crypto from "crypto";

export default class VerificationService {
  sendCode(user: User) {
    const verificationCode = crypto.randomInt(0, 1000000);
    const mailer = new NodemailerUtils();

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
