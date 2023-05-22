import { Request, Response } from "express";
import VerificationService from "../services/VerificationService";
import JWTUtil from "../utils/JWTUtils";
import UserService from "../services/UserService";

export default class VerificationController {
  private verificationService = new VerificationService();
  private userService = new UserService();

  getVerifyEmailPage(req: Request, res: Response) {
    const state = req.query.state as string;
    let isStateValid = true;
    let jwtData;

    try {
      jwtData = JWTUtil.verify({ token: state });
      console.log(jwtData);
    } catch (error) {
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

  async resendVerificationCode(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      const token = JWTUtil.sign({ payload: { email, codeSent: false } });
      return res.redirect(`/verifyEmail?state=${token}`);
    }

    try {
      const user = await this.userService.getUserBy({ email });
      this.verificationService
        .sendCode(user)
        .then((info) => {
          console.log(info);
          const token = JWTUtil.sign({
            payload: { email: user.email, codeSent: true },
            expiresIn: "10m",
          });
          res.redirect(`/verifyEmail?state=${token}`);
        })
        .catch((error) => {
          console.debug(error);
          const token = JWTUtil.sign({
            payload: { email: user.email, codeSent: false },
            expiresIn: "10m",
          });
          res.redirect(`/verifyEmail?state=${token}`);
        });
    } catch (error) {
      const token = JWTUtil.sign({ payload: { email, codeSent: false } });
      return res.redirect(`/verifyEmail?state=${token}`);
    }
  }
}
